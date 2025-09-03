import jwt from 'jsonwebtoken';
import {
  JWT_ACCESS_TOKEN_SECRET,
  // JWT_REFRESH_TOKEN_SECRET,
} from './constants.js';

function generateTokens(userId) {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  // const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
  //   expiresIn: '1d',
  // });
  return {
    accessToken,
    // refreshToken,
  };
}

function verifyAccessToken(token) {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  return { userId: decoded.id };
}

// function verifyRefreshToken(token) {
//   const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
//   return { userId: decoded.id };
// }

export {
  generateTokens,
  verifyAccessToken,
  // verifyRefreshToken,
};
