// scripts/deploy/upload.ts
import path from "path";
import { loadConfig } from "./config";
import { Client as FtpClient, AccessOptions } from "basic-ftp";
import SFTPClient from "ssh2-sftp-client";
import fs from "fs";

export async function uploadFrontend(distDir: string) {
  const cfg = loadConfig();
  const files = listFiles(distDir);

  if (cfg.ftp.protocol === "sftp") {
    const sftp = new SFTPClient();
    await sftp.connect({
      host: cfg.ftp.host,
      username: cfg.ftp.user,
      password: cfg.ftp.password,
      port: cfg.ftp.port || 22
    });

    await ensureDirSFTP(sftp, cfg.ftp.baseDir);
    for (const file of files) {
      const remote = path.posix.join(cfg.ftp.baseDir, file.relative.replace(/\\/g, "/"));
      await ensureDirSFTP(sftp, path.posix.dirname(remote));
      await sftp.fastPut(file.absolute, remote);
      console.log("↑", remote);
    }
    await sftp.end();
  } else {
    const client = new FtpClient();
    const access: AccessOptions = {
      host: cfg.ftp.host,
      user: cfg.ftp.user,
      password: cfg.ftp.password,
      port: cfg.ftp.port || 21,
      secure: cfg.ftp.secure
    };
    await client.access(access);
    await ensureDirFTP(client, cfg.ftp.baseDir);
    await client.cd(cfg.ftp.baseDir);
    for (const file of files) {
      const targetDir = path.posix.dirname(file.relative.replace(/\\/g, "/"));
      if (targetDir !== ".") await ensureDirFTP(client, targetDir);
      await client.uploadFrom(file.absolute, file.relative.replace(/\\/g, "/"));
      console.log("↑", path.posix.join(cfg.ftp.baseDir, file.relative.replace(/\\/g, "/")));
    }
    client.close();
  }
}

function listFiles(root: string) {
  const out: { absolute: string; relative: string }[] = [];
  function walk(dir: string, rel = ".") {
    for (const name of fs.readdirSync(dir)) {
      const abs = path.join(dir, name);
      const r = rel === "." ? name : path.join(rel, name);
      const stat = fs.statSync(abs);
      if (stat.isDirectory()) walk(abs, r);
      else out.push({ absolute: abs, relative: r });
    }
  }
  walk(root);
  return out;
}

async function ensureDirFTP(client: any, dir: string) {
  const parts = dir.split("/").filter(Boolean);
  for (let i = 0; i < parts.length; i++) {
    const segment = parts.slice(0, i + 1).join("/");
    try { await client.send("CWD " + segment); }
    catch { await client.send("MKD " + segment); }
  }
}

async function ensureDirSFTP(client: any, dir: string) {
  const parts = dir.split("/").filter(Boolean);
  let current = "";
  for (const part of parts) {
    current = current ? `${current}/${part}` : part;
    try { await client.mkdir(current, true); } catch {}
  }
}
