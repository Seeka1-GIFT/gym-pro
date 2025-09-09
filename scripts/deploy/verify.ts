// scripts/deploy/verify.ts
import fetch from "node-fetch";
import { loadConfig } from "./config";

export async function verifyAll() {
  const cfg = loadConfig();
  const api = cfg.viteApiUrl.replace(/\/$/, "");
  const health = `${api}/healthz`;

  try {
    const r = await fetch(health, { timeout: 15000 as any });
    const t = await r.text();
    console.log("\nBackend /healthz:", r.status, t);
  } catch (e:any) {
    console.error("\nBackend health check failed:", e?.message ?? e);
  }

  console.log("\nFrontend (Hostinger) is uploaded to:", `https://${cfg.ftp.host}/`);
  console.log("If your site is on a domain, open it and exercise login/members/routes.");
}
