import {
  productListupService,
  productRegisterService,
  productPutService,
  productDeleteService
} from "../services/product.service.js";

// 개선하면 좋을 점
// Number(productId)만 썼는데 사용자가 URL에 "abc" 같은걸 넣으면 NaN이 들어갈 수 있음 parseInt + isNaN 체크 해주면 더 견고해짐

// 상품 목록 조회
export async function productListupController(req, res, next) {
  try {
    const userId = req.user.userId;

    const list = await productListupService.productList(userId)

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
export async function productRegisterController(req, res, next) {
  try {
    // Middlewares/auth.js에서 넣어준 값
    const userId = req.user.userId;

    // 프론트에서 정보 받아오기
    const { title, content } = req.body;

    // 서비스 로직
    const fromService = await productRegisterService.productRegister(userId, title, content);

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
export async function productPutController(req, res, next) {
  try {
    // 수정하려는 상품 id 가져오기
    const productId = req.params.productId;

    // 수정할 데이터
    const { title, content } = req.body;

    // 서비스 로직
    const updatedProduct = await productPutService.productPut(
      userId,
      productId,
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
export async function productDeleteController(req, res, next) {
  try {
    // 누가 요청을 보냈는지 확인
    const userId = req.user.userId;

    // 삭제하려는 상품 id 가져오기
    const productId = req.params.productId;

    // 서비스 로직
    const deletedProduct = await productDeleteService.productDelete(userId, productId);

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
