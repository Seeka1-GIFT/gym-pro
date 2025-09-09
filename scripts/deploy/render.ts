// scripts/deploy/render.ts
import fetch from "node-fetch";
import { loadConfig } from "./config";

const BASE = "https://api.render.com/v1";

export async function setRenderEnvAndDeploy() {
  const cfg = loadConfig();
  if (!cfg.render?.apiKey || !cfg.render?.serviceId) {
    console.log("Render API credentials not provided. Skipping Render env/deploy step.");
    return;
  }

  const headers = {
    "Authorization": `Bearer ${cfg.render.apiKey}`,
    "Accept": "application/json",
    "Content-Type": "application/json"
  };

  // 1) Set env vars (merge/overwrite)
  const envVars = [
    { key: "NODE_ENV", value: "production" },
    { key: "PORT", value: "5000" },
    { key: "DATABASE_URL", value: process.env.DATABASE_URL ?? "" },   // set via process env when running
    { key: "JWT_ACCESS_SECRET", value: process.env.JWT_ACCESS_SECRET ?? "" },
    { key: "JWT_REFRESH_SECRET", value: process.env.JWT_REFRESH_SECRET ?? "" },
    { key: "CORS_ORIGIN", value: cfg.viteApiUrl.replace(/\/$/, "").replace("https://", "https://").replace("http://","http://") } // not perfect, but OK
  ];

  // Render API: upsert env vars
  for (const ev of envVars) {
    if (!ev.value) continue;
    await fetch(`${BASE}/services/${cfg.render.serviceId}/env-vars`, {
      method: "POST",
      headers,
      body: JSON.stringify(ev)
    });
  }

  // 2) Trigger a deploy
  const res = await fetch(`${BASE}/services/${cfg.render.serviceId}/deploys`, {
    method: "POST",
    headers,
    body: JSON.stringify({ clearCache: true })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Render deploy trigger failed: ${res.status} ${txt}`);
  }
  const json = await res.json();
  console.log("Render deployment triggered:", json);
}
