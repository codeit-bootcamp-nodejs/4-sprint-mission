import jwt from 'jsonwebtoken';

const ACCESS_KEY = process.env.JWT_ACCESS_SECRET;
const REFRESH_KEY = process.env.JWT_REFRESCH_SECRET;

export function generateTokens(userId){
  const accessToken = jwt.sign({ sub: userId } , ACCESS_KEY, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ sub: userId }, REFRESH_KEY, { expiresIn: '1d' });
  return { accessToken, refreshToken };
}

