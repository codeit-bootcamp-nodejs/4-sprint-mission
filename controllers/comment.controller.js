import {
  CommentDeleteService,
  CommentListService,
  CommentPutService,
  CommentRegisterPostService,
  CommentRegisterProductService,
} from "../services/comment.service.js";


// 댓글 목록 조회
export async function CommentListController(req, res, next) {
  try {
    const userId = req.user.userId;

    const list =  await CommentListService(userId)

    // 응답
    res.status(200).json({
      message: "댓글 목록 조회 성공",
      data: list
    })
  } catch (err) {
    next (err);
  }
}
// 유저와 상품을 같이쓰면서 댓글에 등록해야함. 코멘트를 달려면

// 로그인한 유저만 상품에 댓글을 등록할 수 있습니다.                                 producId 사용하는곳이 없는지 확인 필요.
export async function CommentRegisterProductController(req, res, next) {
  try {
    // 로그인 id 가져오기
    const userId = req.user.userId;

    // 상품 id 가져오기
    const productId = req.params.productId;

    // 댓글 필요 요소 가져오기
    const { content } = req.body;

    // 서비스 로직
    const CreatedComment = await CommentRegisterProductService(
      userId,
      productId,
      content
    );

    // 응답
    res.status(201).json({
      message: "댓글 등록 성공",
      data: CreatedComment,
    });
  } catch (err) {
    next(err);
  }
}

// 로그인한 유저만 게시글에 댓글을 등록할 수 있습니다.
export async function CommentRegisterPostController(req, res, next) {
  try {
    // 로그인 id 가져오기
    const userId = req.user.userId;

    // 게시글 id 가져오기
    const postId = req.params.postId;

    // 댓글 필요 요소 가져오기
    const { content } = req.body;

    // 서비스 로직
    const createdComment = await CommentRegisterPostService(
      userId,
      postId,
      content
    );

    // 응답
    res.status(201).json({
      message: "댓글 등록 성공",
      data: createdComment,
    });
  } catch (err) {
    next(err);
  }
}

// 댓글을 단 유저만 해당 댓글을 수정할 수 있습니다.
export async function CommentPutController(req, res, next) {
  try {
    // 유저 id 가져오기
    const userId = req.user.userId;

    // 댓글 id 가져오기
    const commentId = req.params.commentId;

    // 수정할 데이터
    const { content } = req.body;

    // 서비스 로직
    const updatedComment = await CommentPutService(userId, commentId, content);

    // 응답
    res.status(200).json({
      message: "상품 댓글 수정 성공",
      data: updatedComment,
    });
  } catch (err) {
    next(err);
  }
}

// 댓글을 단 유저만 해당 댓글을 삭제할 수 있습니다.
export async function CommentDeleteController(req, res, next) {
  try {
    // 유저 id 가져오기
    const userId = req.user.userId;

    // 댓글 불러오기
    const commentId = req.params.commentId;

    // 서비스 로직
    const deletedComment = await CommentDeleteService(userId, commentId);

    // 응답
    res.status(200).json({
      message: "상품 댓글 삭제 성공",
      data: deletedComment,
    });
  } catch (err) {
    next(err);
  }
}
