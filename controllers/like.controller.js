import {
  guessLikedPostService,
  guessLikedProductService,
  likePostService,
  likeProductListService,
  likeProductService,
} from "../services/like.service.js";

// 현재 좋아요는 아무런 정보도 없는 상태
// 로그인한 유저는 상품에 '좋아요' 와 '좋아요 취소' 가능
export async function likeProductController(req, res, next) {
  try {
    const userId = req.user.userId;
    const productId = Number(req.params.productId);

    // 서비스 로직
    const createdLike = await likeProductService.likeProduct(userId, productId);

    const isAdded = createdLike.message === "좋아요 추가";

    res.status(200).json({
      message: isAdded ? "좋아요 추가" : "좋아요 취소",
      data: createdLike,
    });
  } catch (err) {
    next(err);
  }
}

// 로그인한 유저는 게시글에 '좋아요'와 '좋아요 취소' 가능
export async function likePostController(req, res, next) {
  try {
    const userId = req.user.userId;
    const postId = Number(req.params.postId);

    // 서비스 로직
    const createdLikePost = await likePostService.likePost(userId, postId);

    const isAdded = createdLikePost.message === "좋아요 추가";

    res.status(200).json({
      message: isAdded ? "좋아요 추가" : "좋아요 취소",
      data: createdLikePost,
    });
  } catch (err) {
    next(err);
  }
}

// 상품 또는 게시글을 조회할 때, 유저가 '좋아요'를 누른 항목인지 확인할 수 있도록 isLiked와 같은 불린형 필드를 리스폰스 객체에 포함시켜 리스폰스해 주세요.
// 상품을 조회할 때 , 유저가 좋아요를 누른 항목인지 먼저 작성
export async function guessLikedProductController(req, res, next) {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);

    // 서비스 로직
    const { listup, isLiked } = await guessLikedProductService.guessLikedProduct(
      userId,
      productId
    );

    res.status(200).json({
      message: "상품을 불러왔습니다",
      data: { ...listup, isLiked },
    });
  } catch (err) {
    next(err);
  }
}

// 게시글을 조회할 때 좋아요를 누른 항목인지 먼저 작성
export async function guessLikedPostController(req, res, next) {
  try {
    const userId = req.user.userId;
    const postId = Number(req.params.postId);

    // 서비스 로직
    const { listup, isLiked } = await guessLikedPostService.guessLikedPost(userId, postId);

    res.status(200).json({
      message: "게시글을 불러왔습니다",
      data: { ...listup, isLiked },
    });
  } catch (err) {
    next(err);
  }
}

// 유저가 '좋아요'를 표시한 상품의 목록을 조회하는 기능을 구현합니다.
// 좋아요를 한 품목들을 골라서 상품 목록을 조회한다 이 걸 구상하는데 어려움이 있었음.
export async function likeProductListController(req, res, next) {
  try {
    const userId = req.user.userId;

    // 서비스 로직
    const list = await likeProductListService.likeProductList(userId);

    res.status(200).json({
      message: "좋아요한 상품을 불러왔습니다.",
      data: list,
    });
  } catch (err) {
    next(err);
  }
}
