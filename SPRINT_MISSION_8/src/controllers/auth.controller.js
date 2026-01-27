import { prisma } from "../prisma/client.js";
import { RegisterDto, LoginDto } from "../validations/schemas.js";
import { hashPassword, verifyPassword } from "../utils/bcrypt.js";
import { signAccessToken } from "../utils/jwt.js";
import { issueRefreshToken, rotateRefreshToken, verifyAndConsumeRefreshToken } from "../utils/refreshToken.js";

function stripUser(u) {
  const { password, ...rest } = u;
  return rest;
}

export async function register(req, res) {
  const body = RegisterDto.parse(req.body);
  const exists = await prisma.user.findFirst({
    where: { OR: [{ email: body.email }, { nickname: body.nickname }] },
  });
  if (exists) return res.status(409).json({ message: "이미 사용 중인 이메일/닉네임" });

  const user = await prisma.user.create({
    data: { email: body.email, nickname: body.nickname, password: await hashPassword(body.password) },
  });

  const at = signAccessToken({ sub: user.id, email: user.email, nickname: user.nickname });
  const { raw: rt, jti } = await issueRefreshToken(user.id);

  return res.status(201).json({ user: stripUser(user), tokens: { accessToken: at, refreshToken: `${jti}.${rt}` } });
}

export async function login(req, res) {
  const body = LoginDto.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user) return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
  const ok = await verifyPassword(body.password, user.password);
  if (!ok) return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });

  const at = signAccessToken({ sub: user.id, email: user.email, nickname: user.nickname });
  const { raw: rt, jti } = await issueRefreshToken(user.id);

  return res.json({ user: stripUser(user), tokens: { accessToken: at, refreshToken: `${jti}.${rt}` } });
}

export async function refresh(req, res) {
  const input = (req.body?.refreshToken || req.cookies?.rt || "").toString();
  const [jti, raw] = input.split(".");
  if (!jti || !raw) return res.status(400).json({ message: "Bad refresh token" });

  try {
    const token = await verifyAndConsumeRefreshToken(raw, jti);
    const user = await prisma.user.findUnique({ where: { id: token.userId } });
    const { raw: newRt, jti: newJti } = await rotateRefreshToken(jti, token.userId);
    const at = signAccessToken({ sub: user.id, email: user.email, nickname: user.nickname });

    return res.json({ user: stripUser(user), tokens: { accessToken: at, refreshToken: `${newJti}.${newRt}` } });
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

export async function logout(req, res) {
  await prisma.refreshToken.updateMany({ where: { userId: req.user.id, revoked: false }, data: { revoked: true } });
  res.clearCookie("rt");
  return res.json({ message: "Logged out" });
}
