// scripts/deploy/frontend.ts
import path from "path";
import fs from "fs";
import child_process from "child_process";
import AdmZip from "adm-zip";
import { loadConfig } from "./config";

function exec(cmd: string, cwd?: string) {
  console.log(`\n$ ${cmd}`);
  child_process.execSync(cmd, { stdio: "inherit", cwd });
}

export function buildFrontend() {
  const cfg = loadConfig();
  const appDir = path.resolve("gym-frontend");

  // Skip npm ci if node_modules exists (dependencies already installed)
  const nodeModulesPath = path.join(appDir, "node_modules");
  if (!fs.existsSync(nodeModulesPath)) {
    console.log("Installing frontend dependencies...");
    exec("npm ci", appDir);
  } else {
    console.log("Frontend dependencies already installed, skipping npm ci");
  }

  // Build with runtime API URL
  // (Vite reads VITE_API_URL during build)
  const env = { ...process.env, VITE_API_URL: cfg.viteApiUrl };
  console.log(`\nBuilding with VITE_API_URL=${cfg.viteApiUrl}`);
  child_process.execSync("npm run build", { stdio: "inherit", cwd: appDir, env });

  const distDir = path.join(appDir, "dist");
  if (!fs.existsSync(distDir)) throw new Error("frontend dist/ not found. Build failed.");

  // Zip for Hostinger (optional convenience)
  const zipPath = path.resolve("dist_upload.zip");
  const zip = new AdmZip();
  zip.addLocalFolder(distDir, "");
  zip.writeZip(zipPath);
  console.log(`\nCreated ${zipPath}`);
  return { distDir, zipPath };
}
