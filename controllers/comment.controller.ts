import type { Request, Response, NextFunction } from "express";
import {
  commentDeleteService,
  commentListService,
  commentPutService,
  commentRegisterPostService,
  commentRegisterProductService,
} from "../services/comment.service.js";
import { HttpError } from "../middlewares/errorHandler.middleware.js";

// 댓글 목록 조회
export async function commentListController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userIdStr = req.user?.userId;
    if (!userIdStr) throw new HttpError("유저 정보가 없습니다.", 401);
    
    const userId = Number(userIdStr);

    const list =  await commentListService(userId)

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
export async function commentRegisterProductController(req: Request ,res: Response, next: NextFunction): Promise<void> {
  try {
    // 로그인 id 가져오기
    const userIdStr = req.user?.userId;
    if (!userIdStr) throw new HttpError("유저 정보가 없습니다.", 401);
    
    const userId = Number(userIdStr);

    // 상품 id 가져오기
    const productIdStr = req.body.productId;
    if (!productIdStr) throw new HttpError("상품 ID가 없습니다.", 401)
      
    const productId = Number(productIdStr)

    // 댓글 필요 요소 가져오기
    const { content } = req.body;

    // 서비스 로직
    const CreatedComment = await commentRegisterProductService(
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
export async function commentRegisterPostController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 로그인 id 가져오기
    const userIdStr = req.user?.userId;
    if (!userIdStr) throw new HttpError("유저 정보가 없습니다.", 401);
    
    const userId = Number(userIdStr);

    // 게시글 id 가져오기
    const postIdStr = req.body.postId;
    if (!postIdStr) throw new HttpError("게시글 정보가 없습니다.", 401);

    const postId = Number(postIdStr);

    
    // 댓글 필요 요소 가져오기
    const { content } = req.body;

    // 서비스 로직
    const createdComment = await commentRegisterPostService(
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
export async function commentPutController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 유저 id 가져오기
    const userIdStr = req.user?.userId;
    if (!userIdStr) throw new HttpError("유저 정보가 없습니다.", 401);
    
    const userId = Number(userIdStr);

    // 댓글 id 가져오기
    const commentIdStr = req.body.postId;
    if (!commentIdStr) throw new HttpError("게시글 정보가 없습니다.", 401);

    const commentId = Number(commentIdStr);

    // 수정할 데이터
    const { content } = req.body;

    // 서비스 로직
    const updatedComment = await commentPutService(userId, commentId, content);

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
export async function commentDeleteController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 유저 id 가져오기
    const userIdStr = req.user?.userId;
    if (!userIdStr) throw new HttpError("유저 정보가 없습니다.", 401);
    
    const userId = Number(userIdStr);

    // 댓글 불러오기
    const commentIdStr = req.body.postId;
    if (!commentIdStr) throw new HttpError("게시글 정보가 없습니다.", 401);

    const commentId = Number(commentIdStr);

    // 서비스 로직
    const deletedComment = await commentDeleteService(userId, commentId);

    // 응답
    res.status(200).json({
      message: "상품 댓글 삭제 성공",
      data: deletedComment,
    });
  } catch (err) {
    next(err);
  }
}
