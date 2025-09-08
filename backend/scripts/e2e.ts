import { request as httpRequest } from "http";
import { request as httpsRequest } from "https";

const BASE = process.env.BASE_URL || "http://127.0.0.1:5000";

type J = any;

function sleep(ms:number){ return new Promise(r=>setTimeout(r,ms)); }

function httpJson(method: string, path: string, body?: J, token?: string): Promise<J> {
  return new Promise((resolve, reject) => {
    const url = new URL(path.startsWith("http") ? path : BASE + path);
    const reqFn = url.protocol === "https:" ? httpsRequest : httpRequest;

    const req = reqFn(
      {
        hostname: url.hostname,
        port: url.port || (url.protocol === "https:" ? 443 : 80),
        path: url.pathname + url.search,
        method,
        headers: {
          "Content-Type": "application/json",
          "Connection": "close",             // avoid keep-alive (prevents ECONNRESET on Windows)
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          const code = res.statusCode ?? 0;
          const ok = code >= 200 && code < 300;
          if (!ok) return reject(new Error(`${method} ${url.pathname} -> ${code} ${data}`));
          resolve(data ? JSON.parse(data) : null);
        });
      }
    );

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function httpJsonRetry(method:string, path:string, body?:J, token?:string, retries=4){
  let last:any;
  for (let i=0;i<=retries;i++){
    try { return await httpJson(method, path, body, token); }
    catch(e:any){
      last = e;
      const msg = String(e.message||e);
      // Don't retry on 409 (conflict) or other client errors (4xx), only retry on network/server errors
      if (msg.includes("409") || i===retries || !/(ECONNRESET|ECONNREFUSED|ETIMEDOUT|socket hang up|502|503|504)/i.test(msg)) throw e;
      await sleep(400*(i+1));
    }
  }
  throw last;
}

async function waitHealthz(ms = 60000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const h = await httpJsonRetry("GET", "/healthz");
      if (h?.ok) { console.log("✓ healthz OK"); return; }
    } catch {}
    await sleep(500);
  }
  throw new Error("healthz not ready");
}

async function registerIfNeeded(name: string, email: string, password: string, role = "ADMIN") {
  try {
    const r = await httpJsonRetry("POST", "/api/auth/register", { name, email, password, role });
    console.log("✓ Registered admin");
    return r;
  } catch (e: any) {
    const msg = String(e.message || e);
    if (msg.includes("409")) { 
      console.log("• Admin already exists"); 
      return null; 
    }
    console.error("Registration error:", msg);
    throw e;
  }
}

(async () => {
  try {
    await waitHealthz();

    const adminEmail = "admin@example.com";
    const adminPass = "secret123";
    
    console.log("Attempting to register admin...");
    await registerIfNeeded("Admin", adminEmail, adminPass, "ADMIN");
    
    // Small delay to ensure database is ready
    await sleep(500);
    
    console.log("Attempting to login...");
    const loginRes = await httpJsonRetry("POST", "/api/auth/login", { email: adminEmail, password: adminPass });
    let access = loginRes.accessToken as string;
    console.log("✓ Login successful");

    const S = Date.now().toString().slice(-6);

    const plan = await httpJsonRetry("POST", "/api/plans", { name: `Monthly-${S}`, price: 25, durationDays: 30 }, access);
    console.log("✓ Plan:", plan.id);

    const member = await httpJsonRetry("POST", "/api/members", { fullName: `Ali Yusuf ${S}`, phone: `615${S}` }, access);
    console.log("✓ Member:", member.id);

    const startDate = new Date().toISOString();
    const membership = await httpJsonRetry("POST", "/api/memberships", { memberId: member.id, planId: plan.id, startDate }, access);
    console.log("✓ Membership:", membership.id);

    const attIn = await httpJsonRetry("POST", "/api/attendance/check-in", { memberId: member.id, source: "MANUAL" }, access);
    console.log("✓ Check-in:", attIn.id);

    await httpJsonRetry("POST", "/api/attendance/check-out", { attendanceId: attIn.id }, access);
    console.log("✓ Check-out");

    const pay = await httpJsonRetry("POST", "/api/payments", { memberId: member.id, membershipId: membership.id, amount: 25, method: "CASH", reference: `RCPT-${S}` }, access);
    console.log("✓ Payment:", pay.id);

    const stats = await httpJsonRetry("GET", "/api/stats/overview", undefined, access);
    console.log("✓ Stats:", stats);

    const list = await httpJsonRetry("GET", `/api/members?q=ali&page=1&limit=5`, undefined, access);
    console.log(`✓ Members list total=${list.total}`);

    console.log("\nALL DONE ✅");
  } catch (err: any) {
    console.error("E2E ERROR:", err?.message || err);
    process.exitCode = 1;
  }
})();