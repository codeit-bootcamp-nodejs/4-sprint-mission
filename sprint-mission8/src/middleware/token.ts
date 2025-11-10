import jwt from 'jsonwebtoken';

const createToken = (user: { id: number }, type?: string) => {
  const payload = { userId: user.id };
  const options: jwt.SignOptions = { 
    expiresIn: type === 'refresh' ? '2w' : '1h' };
  return jwt.sign(payload, process.env.JWT_SECRET!, options);
}

export default { 
  createToken,
};