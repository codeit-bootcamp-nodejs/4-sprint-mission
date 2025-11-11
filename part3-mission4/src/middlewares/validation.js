import prisma from '../lib/prismaClient.js';
import { z } from 'zod';

class Validation {
  // 상품 생성
  productSchema = z.object({
    name: z.preprocess(
      (val) => (val === undefined ? '' : val),
      z
        .string({
          required_error: '상품 이름은 필수입니다.',
          invalid_type_error: '상품 이름은 문자열이어야 합니다.',
        })
        .min(1, '상품 이름은 필수입니다.')
    ),
    description: z.preprocess(
      (val) => (val === undefined ? '' : val),
      z
        .string({
          required_error: '상품 설명은 필수입니다.',
          invalid_type_error: '상품 설명은 문자열이어야 합니다.',
        })
        .min(1, '상품 설명은 필수입니다.')
    ),
    price: z.preprocess(
      (val) => (val === undefined ? null : val),
      z
        .number({
          required_error: '가격은 필수입니다.',
          invalid_type_error: '가격은 숫자여야 합니다.',
        })
        .positive('가격은 양수여야 합니다.')
    ),
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
    title: z.preprocess(
      (val) => (val === undefined ? '' : val),
      z
        .string({
          required_error: '제목은 필수입니다.',
          invalid_type_error: '제목은 문자열이어야 합니다.',
        })
        .min(1, '제목은 필수입니다.')
    ),
    content: z.preprocess(
      (val) => (val === undefined ? '' : val),
      z
        .string({
          required_error: '내용은 필수입니다.',
          invalid_type_error: '내용은 문자열이어야 합니다.',
        })
        .min(1, '내용은 필수입니다.')
    ),
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
    content: z.preprocess(
      (val) => (val === undefined ? '' : val),
      z
        .string({
          required_error: '내용은 필수입니다.',
          invalid_type_error: '내용은 문자열이어야 합니다.',
        })
        .min(1, '내용은 필수입니다.')
    ),
  });

  // ID 검증
  idSchema = z.preprocess(
    (val) => Number(val),
    z
      .number({
        required_error: 'ID는 필수입니다.',
        invalid_type_error: 'ID는 숫자여야 합니다.',
      })
      .positive('ID는 양수여야 합니다.')
  );

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
      console.log('📌 들어온 body:', req.body);
      const result = schema.safeParse(req.body);
      if (!result.success) {
        console.error('❌ ZodError:', result.error.issues);
        return res.status(400).json({
          message: result.error?.issues.map((e) => e.message).join(', '),
        });
      }
      next();
    };
  }

  validateParam(paramName, schema) {
    return (req, res, next) => {
      console.log('📌 들어온 params:', req.params);
      const result = schema.safeParse(req.params[paramName]);
      if (!result.success) {
        console.error('❌ ZodError:', result.error.issues);
        return res.status(400).json({
          message: result.error?.issues.map((e) => e.message).join(', '),
        });
      }
      next();
    };
  }
}

export const validation = new Validation();
