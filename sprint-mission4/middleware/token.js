import jwt from 'jsonwebtoken';

const createToken = (user,type) => {
  const payload = { userId: user.id };
  const options = { 
    expiresIn: type === 'refresh' ? '2w' :'24h' };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

export default { 
  createToken,
};