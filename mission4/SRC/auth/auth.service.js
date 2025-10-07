import jwt from 'jsonwebtoken';
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from '../../lib/constants.js';

import { UserService } from '../user/user.service.js';
import bcrypt from 'bcrypt';

const userService = new UserService();

export class AuthService {
  async validateUser(email, password) {
    const user = await userService.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  generateToken(userId) {
    const accesToken = jwt.sign({ sub : userId} ,JWT_ACCESS_TOKEN_SECRET,{
      expiresIn: '30mins'
    })
    const refreshToken = jwt.sign({sub:userId}, JWT_REFRESH_TOKEN_SECRET,{
      expiresIn:"1d"
    })
    return {accesToken,refreshToken}
  }

  verifyAccessToken(token) {
    const decoded = jwt.verify(token,JWT_ACCESS_TOKEN_SECRET);
    return {userId :decoded.sub}
  }
  verifyRefreshToken(token){
    const decoded = jwt.verify(token,JWT_REFRESH_TOKEN_SECRET);
    return {userId :decoded.sub}

  }
}
