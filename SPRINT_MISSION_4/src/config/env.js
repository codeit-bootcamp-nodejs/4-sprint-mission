export const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
export const REFRESH_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || "7", 10);
export const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);