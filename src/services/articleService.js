import prisma from "../lib/prisma.js";

export async function createArticle(data) {
  return prisma.article.create({
    data,
  });
}

export async function getArticleById(id) {
  return await prisma.article.findUnique({
    where: { id },
    include: {
      User: {
        select: {
          id: true,
          nickname: true, // 작성자 정보
        },
      },
      articleLikes: {
        select: {
          userId: true, // 좋아요 누른 유저 ID만 가져옴
        },
      },
      _count: {
        select: { articleLikes: true },
      },
    },
  });
}

export async function updateArticle(id, data) {
  return await prisma.article.update({
    where: { id },
    data,
  });
}

export async function deleteArticle(id) {
  return await prisma.article.delete({
    where: { id },
  });
}

export async function listArticle({ page, pageSize, keyword }) {
  let where = {};

  const trimmedKeywords = Array.isArray(keyword)
    ? keyword.map((word) => word.trim()).filter((word) => word.length > 0)
    : [];

  if (trimmedKeywords.length > 0) {
    where = {
      OR: trimmedKeywords.flatMap((word) => [
        { title: { contains: word, mode: "insensitive" } },
        { content: { contains: word, mode: "insensitive" } },
      ]),
    };
  }

  const total = await prisma.article.count({ where });

  const articles = await prisma.article.findMany({
    where,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
  });
  return { data: articles, total, page, pageSize };
}

// 게시글 좋아요 토글 기능
export async function toggleArticleLike(userId, articleId) {
  // 1. 현재 사용자가 이 게시글에 이미 좋아요를 눌렀는지 확인
  const existing = await prisma.articleLike.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });

  if (existing) {
    // 2-1. 이미 좋아요 상태라면 → 좋아요 취소 (삭제)
    await prisma.articleLike.delete({
      where: { userId_articleId: { userId, articleId } },
    });
  } else {
    // 2-2. 아직 좋아요를 안 눴다면 → 좋아요 추가 (생성)
    await prisma.articleLike.create({ data: { userId, articleId } });
  }

  // 3. 변경된 이후의 총 좋아요 개수를 다시 계산
  //    → 클라이언트에서 UI(하트 상태 + 숫자)를 한 번에 업데이트할 수 있도록 반환
  const likeCount = await prisma.articleLike.count({ where: { articleId } });

  // 4. isLiked = 현재 사용자 기준 좋아요 상태
  //    likeCount = 게시글의 총 좋아요 개수
  return { isLiked: !existing, likeCount };
}
