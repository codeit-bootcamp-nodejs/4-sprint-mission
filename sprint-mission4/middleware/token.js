import jwt from 'jsonwebtoken';
import UserService from '../service/user-service.js';


const createToken = async(user) => {
  const payload = { userId: user.email };
  const options = { expiresIn: '1h' };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

export default { 
  createToken,
};