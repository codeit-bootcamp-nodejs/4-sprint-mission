import bcrypt from "bcryptjs";
import { BCRYPT_ROUNDS } from "../config/env.js";

export async function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
