import * as likeRepo from "../repository/like_repository";

export async function ArticleLikeService({ id, user }: Article.Delete) {
  const alreadyLike = await likeRepo.findUniqueArticle({ id, user });
  if (alreadyLike) {
    await likeRepo.deleteArticleLikeRepo({ id, user });
    return { message: "좋아요가 취소되었습니다." };
  } else {
    await likeRepo.ArticleLikeRepo({ id, user });
    return { message: "좋아요 성공" };
  }
}

export async function ProductLikeService({ id, user }: Article.Delete) {
  const productId = id;
  const alreadyLike = await likeRepo.findUniqeProduct({ id, user });
  if (alreadyLike) {
    await likeRepo.deleteProductLikeRepo({ id, user });
    return { message: "좋아요가 취소되었습니다." };
  } else {
    await likeRepo.ProductLikeRepo({ id, user });
    return { message: "좋아요 성공" };
  }
}
