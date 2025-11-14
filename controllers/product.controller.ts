import type { Request, Response, NextFunction } from "express";
import {
  prodcutListupService,
  productDeleteService,
  productPutService,
  productRegisterService,
} from "../services/product.service.js";
import { HttpError } from "../middlewares/errorHandler.middleware.js";

// 개선하면 좋을 점
// Number(productId)만 썼는데 사용자가 URL에 "abc" 같은걸 넣으면 NaN이 들어갈 수 있음 parseInt + isNaN 체크 해주면 더 견고해짐

// 상품 목록 조회
export async function productListupController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const list = await prodcutListupService()

    // 응답
    res.status(200).json({
      message: "상품 조회 성공",
      data: list
    })
  }
  catch (err) {
  next (err);
  }
}
// 로그인한 유저만 상품 등록
export async function productRegisterController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Middlewares/auth.js에서 넣어준 값
    const userIdStr = req.user?.userId;
    if (!userIdStr) throw new HttpError("유저 정보가 없습니다.", 401);
    
    const userId = Number(userIdStr);

    // 프론트에서 정보 받아오기
    const { price, title, content } = req.body as {
      title: string;
      content: string;
      price: number;
    };

    // 서비스 로직
    const fromService = await productRegisterService(userId, price, title, content);

    // 응답
    res.status(200).json({
      message: "상품 등록 성공",
      product: fromService,
    });
  } catch (err) {
    next(err);
  }
}

// 상품을 등록한 유저만 해당 상품의 정보를 수정
export async function productPutController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 누가 요청을 보냈는지 확인
    const userIdStr = req.user?.userId;
    if (!userIdStr) throw new HttpError("유저 정보가 없습니다.", 401);
    
    const userId = Number(userIdStr);

    // 수정하려는 상품 id 가져오기
    const productIdStr = req.params.productId;
    if (!productIdStr) throw new HttpError("유저 정보가 없습니다.", 401)
      
    const productId = Number(productIdStr)

    // 수정할 데이터
    const { price, title, content } = req.body as {
      title: string;
      content: string;
      price: number;
    };

    // 서비스 로직
    const updatedProduct = await productPutService(
      userId,
      productId,
      price,
      title,
      content
    );

    // 응답
    res.status(200).json({
      message: "상품 정보 수정 성공",
      data: updatedProduct,
    });
  } catch (err) {
    next(err);
  }
}

// 상품을 등록한 유저만 상품 정보를 삭제
export async function productDeleteController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 누가 요청을 보냈는지 확인
    const userIdStr = req.user?.userId;
    if (!userIdStr) throw new HttpError("유저 정보가 없습니다.", 401);
    
    const userId = Number(userIdStr);

    // 삭제하려는 상품 id 가져오기
    const productIdStr = req.params.productId;
    if (!productIdStr) throw new HttpError("유저 정보가 없습니다.", 401)

    const productId = Number(productIdStr)

    // 서비스 로직
    const deletedProduct = await productDeleteService(userId, productId);

    // 응답
    res.status(200).json({
      message: "상품이 성공적으로 삭제 되었습니다.",
      product: {
        id: deletedProduct.id,
        title: deletedProduct.title,
        createdAt: deletedProduct.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}
