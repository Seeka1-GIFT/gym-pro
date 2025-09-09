// scripts/deploy/config.ts
import fs from "fs";
import path from "path";

export type DeployConfig = {
  viteApiUrl: string;               // Render backend public URL, e.g. https://your-app.onrender.com
  ftp: {
    host: string;
    user: string;
    password: string;
    port: number;                   // 21 (FTP) or 22 (SFTP)
    secure: boolean;                // true for FTPS, false for plain FTP; SFTP handled separately
    baseDir: string;                // e.g. "public_html"
    protocol: "ftp" | "sftp";
  };
  render?: {
    apiKey: string;
    serviceId: string;
  };
};

const CONFIG_PATH = path.resolve(".deployrc.json");

export function loadConfig(): DeployConfig {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(
      `Missing ${CONFIG_PATH}. Run: npm run deploy:init to generate it and fill values.`
    );
  }
  const raw = fs.readFileSync(CONFIG_PATH, "utf8");
  const cfg = JSON.parse(raw);
  if (!cfg.viteApiUrl) throw new Error("viteApiUrl missing in .deployrc.json");
  if (!cfg.ftp?.host) throw new Error("ftp.host missing in .deployrc.json");
  return cfg;
}

export function createConfigTemplate() {
  const template: DeployConfig = {
    viteApiUrl: "https://YOUR-RENDER-APP.onrender.com",
    ftp: {
      host: "ftp.your-domain.com",
      user: "username",
      password: "********",
      port: 21,
      secure: false,
      baseDir: "public_html",
      protocol: "ftp"
    },
    render: {
      apiKey: "",
      serviceId: ""
    }
  };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(template, null, 2));
  return CONFIG_PATH;
}
