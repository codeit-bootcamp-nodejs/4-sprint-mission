import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

async function register(email, password, nickname) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const existedUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { nickname },
      ],
    },
  });

  if (existedUser) {
    const error = new Error('Already user with that email or nickname exists.');
    throw error;
  }

  const createUser = await prisma.user.create({
    data: { email, password: hashedPassword, nickname },
  });

  const { password: _, ...userWithoutPassword } = createUser;
  return userWithoutPassword;
}

async function updateRefreshToken(userId, refreshToken) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { refreshToken },
  });
  return updatedUser;
}

export default { 
  register, 
  updateRefreshToken,
  };