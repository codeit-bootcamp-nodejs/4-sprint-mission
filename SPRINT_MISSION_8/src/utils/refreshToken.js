import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../prisma/client.js";
import { BCRYPT_ROUNDS, REFRESH_DAYS } from "../config/env.js";

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export async function issueRefreshToken(userId) {
  const raw = crypto.randomBytes(48).toString("base64url");
  const jti = crypto.randomUUID();
  const hashed = await bcrypt.hash(raw, BCRYPT_ROUNDS);

  await prisma.refreshToken.create({
    data: { jti, hashed, userId, expiresAt: addDays(new Date(), REFRESH_DAYS) },
  });

  return { raw, jti };
}

export async function rotateRefreshToken(oldJti, userId) {
  await prisma.refreshToken.updateMany({
    where: { jti: oldJti, userId, revoked: false },
    data: { revoked: true },
  });
  return issueRefreshToken(userId);
}

export async function verifyAndConsumeRefreshToken(rawToken, jtiFromClient) {
  const token = await prisma.refreshToken.findUnique({ where: { jti: jtiFromClient } });
  if (!token || token.revoked) throw new Error("invalid_refresh");
  if (token.expiresAt < new Date()) throw new Error("expired_refresh");

  const ok = await bcrypt.compare(rawToken, token.hashed);
  if (!ok) throw new Error("invalid_refresh");
  return token;
}
