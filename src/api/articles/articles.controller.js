const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 게시글 등록
exports.createArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).json(article);
  } catch (error) {
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 목록 조회
exports.getArticles = async (req, res, next) => {
  try {
    // 쿼리 파라미터에서 검색, 정렬, 페이지네이션 정보 추출
    const { search, sort, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit; // 페이지네이션을 위한 offset 계산

    // 검색어가 있는 경우 where 조건 생성
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } }, // 제목에서 검색 (대소문자 구분 안함)
            { content: { contains: search, mode: 'insensitive' } }, // 내용에서 검색
          ],
        }
      : {};

    // 정렬 조건 설정 (기본은 오름차순, 'recent'일 경우 최신순)
    const orderBy = sort === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };

    const articles = await prisma.article.findMany({
      where,
      orderBy,
      skip: offset,
      take: parseInt(limit),
      select: { id: true, title: true, content: true, createdAt: true }, // 필요한 필드만 선택
    });

    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};

// 게시글 상세 조회
exports.getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, title: true, content: true, createdAt: true },
    });

    if (!article) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

// 게시글 수정
exports.updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { title, content },
    });
    res.status(200).json(updatedArticle);
  } catch (error) {
    next(error);
  }
};

// 게시글 삭제
exports.deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // 성공적으로 삭제되었으나 컨텐츠는 없음을 알림
  } catch (error) {
    next(error);
  }
};
