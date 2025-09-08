import { spawn } from "child_process";
import { request } from "http";

const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";
const BASE = process.env.BASE_URL || "http://127.0.0.1:5000";

function wait(ms:number){ return new Promise(r=>setTimeout(r,ms)); }

async function waitHealthz(base:string, timeoutMs=60000){
  const started = Date.now();
  while (Date.now() - started < timeoutMs){
    try {
      const data = await httpGet(base + "/healthz");
      const json = JSON.parse(data);
      if (json?.ok) {
        console.log("✓ healthz OK");
        return;
      }
    } catch {}
    await wait(500);
  }
  throw new Error("healthz not ready");
}

function httpGet(urlStr:string):Promise<string>{
  return new Promise((resolve, reject)=>{
    const u = new URL(urlStr);
    const req = request(
      {
        hostname: u.hostname,
        port: u.port || 80,
        path: u.pathname + u.search,
        method: "GET",
        headers: { "Connection": "close" },
      },
      res=>{
        let data = "";
        res.on("data", c=> data += c);
        res.on("end", ()=> resolve(data));
      }
    );
    req.on("error", reject);
    req.end();
  });
}

function killTree(pid:number){
  if (isWin){
    spawn("taskkill", ["/pid", String(pid), "/t", "/f"], { stdio: "ignore" }).on("close", ()=>{});
  } else {
    try { process.kill(-pid, "SIGTERM"); } catch {}
    try { process.kill(pid, "SIGTERM"); } catch {}
  }
}

(async ()=>{
  // 1) Start server (no watch)
  const server = spawn(npmCmd, ["run", "start:ci"], {
    env: { ...process.env, PORT: "5000" },
    stdio: "inherit",
    shell: isWin
  });

  process.on("SIGINT", ()=> { killTree(server.pid!); process.exit(1); });
  process.on("SIGTERM", ()=> { killTree(server.pid!); process.exit(1); });

  // 2) Wait for /healthz
  await waitHealthz(BASE);
  
  // Give server a moment to fully initialize
  await wait(1000);

  // 3) Run E2E
  const e2e = spawn(npmCmd, ["run", "e2e"], {
    env: { ...process.env, BASE_URL: BASE },
    stdio: "inherit",
    shell: isWin
  });

  e2e.on("exit", code=>{
    killTree(server.pid!);
    process.exit(code ?? 0);
  });
})();
