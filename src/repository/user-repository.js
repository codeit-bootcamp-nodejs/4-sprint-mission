export class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 이메일로 사용자 찾기
  findUserByEmail = async (email) => {
    return await this.prisma.user.findUnique({ where: { email } });
  };

  // 사용자 생성
  createUser = async (email, nickname, hashedPassword) => {
    return await this.prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },
    });
  };
}
