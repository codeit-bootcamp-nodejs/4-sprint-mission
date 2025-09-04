import prisma from '../lib/prismaClient.js';
import { z } from 'zod';

// class Validation {
//   validateId(req, res, next) {
//     const paramValue = req.params.id;
//     if (!paramValue || isNaN(parseInt(paramValue))) {
//       return res.status(400).json({ message: '잘못된 ID 형식입니다.' });
//     }
//     next();
//   }

//   validateCommentId(req, res, next) {
//     const paramValue = req.params.commentId;
//     if (!paramValue || isNaN(parseInt(paramValue))) {
//       return res.status(400).json({ message: '잘못된 댓글 ID 형식입니다.' });
//     }
//     next();
//   }

//   validateProductData(req, res, next) {
//     const { name, description, price } = req.body;
//     if (!name || !description || !price) {
//       return res.status(400).json({
//         message: '상품 이름, 설명, 가격은 필수 입력 항목입니다.',
//       });
//     }
//     next();
//   }

//   validateArticleData(req, res, next) {
//     const { title, content } = req.body;
//     if (!title || !content) {
//       return res.status(400).json({
//         message: '제목, 내용을 기입하셨는지 확인해 주세요.',
//       });
//     }
//     next();
//   }

//   validateCommentData(req, res, next) {
//     const { content } = req.body;
//     if (!content) {
//       return res.status(400).json({
//         message: '내용을 기입해 주세요.',
//       });
//     }
//     next();
//   }

//   validateArticleUpdateData(req, res, next) {
//     const { title, content, author } = req.body;
//     if (!title && !content && !author) {
//       return res.status(400).json({
//         message:
//           '수정할 데이터가 없습니다. (title, content, author 중 최소 하나 필요)',
//       });
//     }
//     next();
//   }

//   validateProductUpdateData(req, res, next) {
//     const { name, description, price, tags } = req.body;
//     if (!name && !description && !price && !tags) {
//       return res.status(400).json({
//         message:
//           '수정할 데이터가 없습니다. (name, description, price, tags 중 최소 하나 필요)',
//       });
//     }
//     next();
//   }

//   async validateUsername(req, res, next) {
//     const { username } = req.body;
//     const userCheck = await prisma.user.findUnique({
//       where: { username },
//     });
//     if (userCheck) {
//       return res.status(409).json({ message: '이미 사용 중인 닉네임입니다.' });
//     }
//     next();
//   }
// }

class Validation {
  // 상품 생성
  productSchema = z.object({
    name: z.string().min(1, '상품 이름은 필수입니다.'),
    description: z.string().min(1, '상품 설명은 필수입니다.'),
    price: z.number().positive('가격은 양수여야 합니다.'),
    tags: z.array(z.string()).optional(),
  });

  // 상품 업데이트
  productUpdateSchema = z
    .object({
      name: z.string().optional(),
      description: z.string().optional(),
      price: z.number().positive().optional(),
      tags: z.array(z.string()).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: '수정할 데이터가 없습니다.',
    });

  // 게시글 생성
  articleSchema = z.object({
    title: z.string().min(1, '제목은 필수입니다.'),
    content: z.string().min(1, '내용은 필수입니다.'),
  });

  // 게시글 업데이트
  articleUpdateSchema = z
    .object({
      title: z.string().optional(),
      content: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: '수정할 데이터가 없습니다.',
    });

  // 댓글 생성/업데이트
  commentSchema = z.object({
    content: z.string().min(1, '내용은 필수입니다.'),
  });

  // ID 검증
  idSchema = z.preprocess((val) => Number(val), z.number().positive());

  // 유저네임 중복 검사
  async validateUsername(req, res, next) {
    const { username } = req.body;
    const userCheck = await prisma.user.findUnique({ where: { username } });
    if (userCheck)
      return res.status(409).json({ message: '이미 사용 중인 닉네임입니다.' });
    next();
  }

  // 미들웨어용 스키마 검증 함수
  validate(schema) {
    return (req, res, next) => {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: result.error?.errors?.map((e) => e.message).join(', '),
        });
      }
      next();
    };
  }

  validateParam(paramName, schema) {
    return (req, res, next) => {
      const result = schema.safeParse(req.params[paramName]);
      if (!result.success) {
        return res.status(400).json({
          message: result.error?.errors?.map((e) => e.message).join(', '),
        });
      }
      next();
    };
  }
}

export const validation = new Validation();
