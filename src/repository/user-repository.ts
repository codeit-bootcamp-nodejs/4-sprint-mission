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

  // 좋아요한 상품 목록 조회
  findLikedProductsByUserId = async (userId) => {
    const userWithLikes = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        productLikes: {
          orderBy: { product: { createdAt: 'desc' } },
          select: {
            product: {
              select: { id: true, name: true, price: true, createdAt: true },
            },
          },
        },
      },
    });
    return userWithLikes.productLikes.map((like) => like.product);
  };

  // 좋아요한 게시글 목록 조회
  findLikedArticlesByUserId = async (userId) => {
    const userWithLikes = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        articleLikes: {
          orderBy: { article: { createdAt: 'desc' } },
          select: {
            article: {
              select: { id: true, title: true, content: true, createdAt: true },
            },
          },
        },
      },
    });
    return userWithLikes.articleLikes.map((like) => like.article);
  };
}
