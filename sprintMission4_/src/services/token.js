import jwt from 'jsonwebtoken';

function generateTokens(userId){
  const accessToken = jwt.sign({ sub: userId}, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ sub: userId}, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });
  return { accessToken, refreshToken };
}

export { generateTokens, }