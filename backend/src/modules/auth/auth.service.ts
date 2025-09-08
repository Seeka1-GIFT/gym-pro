import bcrypt from "bcrypt";
import { prisma } from "../../db/client";
import { signAccess, signRefresh, verifyRefresh } from "./jwt";
import crypto from "crypto";

function hashToken(t: string) { 
  return crypto.createHash("sha256").update(t).digest("hex"); 
}

export async function register(data: {
  name: string; email: string; phone?: string; password: string; role?: any;
}) {
  const exists = await prisma.user.findUnique({ where: { email: data.email }});
  if (exists) throw Object.assign(new Error("Email already in use"), { status: 409 });
  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, phone: data.phone, passwordHash, role: data.role ?? "MEMBER" }
  });
  return sanitize(user);
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email }});
  if (!user) throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw Object.assign(new Error("Invalid credentials"), { status: 401 });

  const accessToken = signAccess({ sub: user.id, role: user.role, email: user.email, name: user.name });
  const refreshToken = signRefresh({ sub: user.id });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 7*24*60*60*1000)
    }
  });
  return { user: sanitize(user), accessToken, refreshToken };
}

export async function me(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }});
  return user ? sanitize(user) : null;
}

export async function refresh(oldToken: string) {
  let payload: any;
  try { payload = verifyRefresh(oldToken) as any; } 
  catch { throw Object.assign(new Error("Invalid refresh token"), { status: 401 }); }

  const hash = hashToken(oldToken);
  const stored = await prisma.refreshToken.findFirst({
    where: { userId: payload.sub, tokenHash: hash, revoked: false }
  });
  if (!stored || stored.expiresAt < new Date()) {
    throw Object.assign(new Error("Refresh token expired or revoked"), { status: 401 });
  }

  // rotate: revoke old & issue new
  await prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true }});
  const accessToken = signAccess({ sub: payload.sub });
  const newRefresh = signRefresh({ sub: payload.sub });
  await prisma.refreshToken.create({
    data: { userId: payload.sub, tokenHash: hashToken(newRefresh), expiresAt: new Date(Date.now()+7*24*60*60*1000) }
  });
  return { accessToken, refreshToken: newRefresh };
}

export async function logout(token: string) {
  try {
    // best-effort revoke
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    await prisma.refreshToken.updateMany({ where: { tokenHash: hash, revoked: false }, data: { revoked: true }});
  } catch {}
  return { ok: true };
}

function sanitize(u: any) {
  const { passwordHash, ...rest } = u;
  return rest;
}
