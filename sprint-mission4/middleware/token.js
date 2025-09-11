import jwt from 'jsonwebtoken';

const createToken = async(user) => {
  const payload = { userId: user.id };
  const options = { expiresIn: '24h' };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

export default { 
  createToken,
};