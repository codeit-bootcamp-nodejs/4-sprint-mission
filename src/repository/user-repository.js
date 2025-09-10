export class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 이메일로 사용자 찾기
  findUserByEmail = async (email) => {
    return await this.prisma.user.findUnique({ where: { email } });
  };

  // ID로 사용자 찾기
  findUserById = async (userId) => {
    return await this.prisma.user.findUnique({ where: { id: userId } });
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

  // 사용자 정보 수정
  updateUser = async (userId, dataToUpdate) => {
    return await this.prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });
  };
}
