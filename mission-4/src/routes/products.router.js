import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

/** 상품 등록 API **/
// 인증 미들웨어를 통과해야만 상품을 등록할 수 있습니다.
router.post('/products', authMiddleware, async (req, res, next) => {
  try {
    const { name, content } = req.body;
    const { id: userId } = req.user; // 인증 미들웨어에서 추가된 사용자 정보

    if (!name || !content) {
      return res.status(400).json({ message: '상품명과 내용을 모두 입력해주세요.' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        content,
        authorId: userId, // 상품 등록 시 작성자 ID를 함께 저장합니다.
      },
    });

    return res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
});

/** 상품 목록 조회 API **/
router.get('/products', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // 최신순으로 정렬
      },
    });

    return res.status(200).json({ data: products });
  } catch (err) {
    next(err);
  }
});

/** 상품 상세 조회 API **/
router.get('/products/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: +productId }, //정수로 변환 (parseInt, Number)
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            nickname: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    return res.status(200).json({ data: product });
  } catch (err) {
    next(err);
  }
});

router.put('/products/:productId', authMiddleware, async( req, res, next) => {
  try{
    const { productId } = req.params;
    const { name, content } = req.body;
    const { id: userId } = req.user;

    // 수정할 내용이 아예 없는 경우
    if( !name && !content) {
      return res.status(400).json({ message: "수정할 정보를 입력해주세요."});
    }
    // 수정하려는 상품 존재 여부 확인
    const product = await prisma.product.findUnique({
      where: { id: +productId},
    });

    if(!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다."});
    }
    // 상품을 등록한 사용자인지 확인
    if(product.authorId !== userId) {
      return res.status(403).json({ message: "상품을 수정할 권한 없습니다."});
    }

    // 상품 정보 수정
    const updatedProduct = await prisma.product.update({
      where : { id: +productId},
      data: {
        // 수정할 정보가 있을 경우만, 해당 필드 업데이트
        ...(name && { name }),
        ...(content && {content}),
      },
    });

    return res.status(200).json({ data: updatedProduct})
  } catch(err) {
    next(err);
  }
});

/** 상품 삭제 API **/

router.delete('/products/:productId', authMiddleware, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { id: userId } = req.user; 
    // 삭제하려는 상품 존재 확인
    const product = await prisma.product.findUnique({
      where: { id: +productId },
    });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다."});
    }
    // 상품을 등록한 사용자인지 확인
    if (product.authorId !== userId) {
      return res.status(403).json( { message: "상품 등록자만이 삭제할 수 있습니다."});
    }

    // 상품 삭제
    await prisma.product.delete({
      where: { id: +productId },
    });
    return res.status(200).json({ message: "상품이 성공적으로 삭제 완료"});
  } catch(err) {
    next(err);
  }
});

export default router;
