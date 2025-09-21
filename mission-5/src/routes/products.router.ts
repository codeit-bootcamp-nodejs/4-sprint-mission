import express, { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma.util.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import optionalAuthMiddleware from '../middlewares/optional-auth.middleware.js';

const router = express.Router();

/** 상품 등록 **/
// 인증 미들웨어를 통과해야만 상품을 등록할 수 있습니다.
router.post('/products', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, content } = req.body;
    const user = req.user; // 인증 미들웨어에서 추가된 사용자 정보
    if (!user) {
      return res.status(401).json({ message: "인증 정보가 없습니다." });
    }
    const userId = user.id;

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

/** 상품 목록 조회 **/
router.get('/products', async (req: Request, res: Response, next: NextFunction) => {
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

/** 상품 상세 조회 **/
router.get('/products/:productId', optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const user = req.user; // optionalAuthMiddleware 덕분에 사용자가 있을 수도, 없을 수도 있습니다.

    const product = await prisma.product.findUnique({
      where: { id: +productId },
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

    let isLiked = false;
    if (user) {
      // 로그인한 사용자의 경우, '좋아요' 여부를 확인합니다.
      const like = await prisma.productLike.findUnique({
        where: {
          userId_productId: {
            userId: user.id,
            productId: +productId,
          },
        },
      });
      if (like) {
        isLiked = true;
      }
    }

    // 조회된 상품 정보에 isLiked 필드를 추가하여 응답합니다.
    const responseProduct = { ...product, isLiked };

    return res.status(200).json({ data: responseProduct });
  } catch (err) {
    next(err);
  }
});

router.put('/products/:productId', authMiddleware, async( req: Request, res: Response, next: NextFunction) => {
  try{
    const { productId } = req.params;
    const { name, content } = req.body;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "인증 정보가 없습니다." });
    }
    const userId = user.id;

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

/** 상품 삭제 **/

router.delete('/products/:productId', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const user = req.user; 
    if (!user) {
      return res.status(401).json({ message: "인증 정보가 없습니다." });
    }
    const userId = user.id;
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

/** 상품 좋아요/ 좋아요 취소 **/

router.post('/products/:productId/like', authMiddleware, async(req: Request, res: Response, next: NextFunction) => {
  try{
    const { productId } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "인증 정보가 없습니다." });
    }
    const userId = user.id;

    // 상품이 있는지 확인
    const product = await prisma.product.findUnique({ where: { id: +productId }});
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다."});
    }
    // 사용자가 해당 상품에 이미 좋아요를 눌렀는지 확인
    const existingLike = await prisma.productLike.findUnique({
      where: {
        // prisma 스키마에서 @id([userId, productId])로 조회
        userId_productId: {
          userId,
          productId: +productId,
        },
      },
    });

    // 좋아요가 이미 있다면 좋아요 취소, 없다면 생성(좋아요)
    if(existingLike) {
      await prisma.productLike.delete({
        where: {
          userId_productId: {
            userId,
            productId: +productId,
          },
        },
      });
      return res.status(200).json({ message: "좋아요 취소했습니다."});
    } else {
      await prisma.productLike.create({
        data: {
          userId,
          productId: +productId,
        },
      });
      return res.status(200).json({ message: "좋아요를 눌렀습니다."});
    }
  } catch(err){
    next(err);
  }
});

export default router;
