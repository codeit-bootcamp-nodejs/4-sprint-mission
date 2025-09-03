import prisma from '../lib/prismaClient.js';
import bcrypt from 'bcrypt';

class UserService {
  async register(username, email, password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userCheck = await prisma.user.findUnique({
      where: { username },
    });
    if (userCheck) {
      return res.status(409).json({ message: '이미 사용 중인 닉네임입니다.' });
    }
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      data: userWithoutPassword,
      message: '회원 가입 성공!',
    });
  }
}
