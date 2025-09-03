import prisma from '../lib/prismaClient.js';
import { verifyAccessToken } from '../lib/token.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants.js';

async function authenticate(req, res, next) {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { userId } = verifyAccessToken(accessToken);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    req.user = user;
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

export default authenticate;
