import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { prisma } from '../lib/prismaClient.js';

class Validation {
  // ------------------------------
  // 상품 생성
  // ------------------------------
  productSchema = z.object({
    name: z.preprocess(
      (val) => (val === undefined ? '' : val),
      z.string().nonempty('상품 이름은 필수입니다.')
    ),
    description: z.preprocess(
      (val) => (val === undefined ? '' : val),
      z.string().nonempty('상품 설명은 필수입니다.')
    ),
    price: z.preprocess(
      (val) => (val === undefined ? NaN : val),
      z.number().positive('가격은 양수여야 합니다.')
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

  productPriceUpdateSchema = z.object({
    newPrice: z.preprocess(
      (val) => (val === undefined ? NaN : val),
      z.number().positive('가격은 양수여야 합니다.')
    ),
  });

  // ------------------------------
  // 게시글 생성
  // ------------------------------
  articleSchema = z.object({
    title: z.preprocess(
      (val) => (val === undefined ? '' : val),
      z.string().nonempty('제목은 필수입니다.')
    ),
    content: z.preprocess(
      (val) => (val === undefined ? '' : val),
      z.string().nonempty('내용은 필수입니다.')
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

  // ------------------------------
  // 댓글 생성/업데이트
  // ------------------------------
  commentSchema = z.object({
    content: z.preprocess(
      (val) => (val === undefined ? '' : val),
      z.string().nonempty('내용은 필수입니다.')
    ),
  });

  //  문자열 규칙만 담는 스키마
  passwordRules = z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .max(64, '비밀번호는 최대 64자까지 가능합니다.')
    .regex(/[A-Z]/, '대문자가 최소 1개 포함되어야 합니다.')
    .regex(/[a-z]/, '소문자가 최소 1개 포함되어야 합니다.')
    .regex(/[0-9]/, '숫자가 최소 1개 포함되어야 합니다.')
    .regex(/[^A-Za-z0-9]/, '특수문자가 최소 1개 포함되어야 합니다.');

  //  비번 변경용 스키마 (세 필드)
  passwordSchema = z
    .object({
      currentPassword: z.string().min(1, '현재 비밀번호는 필수입니다.'),
      newPassword: this.passwordRules, // ← 이제 string
      newPasswordConfirm: z.string().min(1, '새 비밀번호 확인은 필수입니다.'),
    })
    .superRefine((val, ctx) => {
      if (val.newPassword !== val.newPasswordConfirm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['newPasswordConfirm'],
          message: '새 비밀번호가 일치하지 않습니다.',
        });
      }
    });

  // ------------------------------
  // ID 검증
  // ------------------------------
  idSchema = z.string().refine((val) => /^[1-9]\d*$/.test(val), {
    message: 'ID가 올바르지 않습니다.',
  });

  // ------------------------------
  // 유저네임, 이메일 중복 검사 미들웨어
  // ------------------------------
  async validateRegister(req: Request, res: Response, next: NextFunction) {
    const { username, email } = req.body;

    // username 중복 체크
    const usernameExists = await prisma.user.findUnique({
      where: { username },
    });
    if (usernameExists) {
      return res.status(409).json({ message: '이미 사용 중인 닉네임입니다.' });
    }

    // email 중복 체크
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) {
      return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
    }

    next();
  }

  //  목록 쿼리 스키마 (필요에 맞게 필드 추가/수정 OK)
  listQuerySchema = z
    .object({
      page: z.coerce.number().int().min(1).default(1),
      pageSize: z.coerce.number().int().min(1).max(100).default(10),
      sortBy: z.enum(['createdAt', 'updatedAt']).default('createdAt'),
      order: z.enum(['asc', 'desc']).default('desc'),
      searchBy: z.enum(['title', 'content', 'username']).optional(),
      keyword: z.string().trim().optional(),
    })
    .superRefine((val, ctx) => {
      const usedSearch =
        val.searchBy !== undefined || val.keyword !== undefined;
      if (usedSearch && (!val.searchBy || !val.keyword)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'searchBy와 keyword를 함께 보내주세요.',
        });
      }
    });

  // ------------------------------
  // 미들웨어용 스키마 검증 함수
  // ------------------------------
  validate(schema: z.ZodTypeAny) {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: result.error.issues.map((e) => e.message).join(', '),
        });
      }
      next();
    };
  }

  validateParam(paramName: string, schema: z.ZodTypeAny) {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.params[paramName]);
      if (!result.success) {
        return res.status(400).json({
          message: result.error.issues.map((e) => e.message).join(', '),
        });
      }
      next();
    };
  }

  //  쿼리 검증 미들웨어 추가
  validateQuery(schema: z.ZodTypeAny) {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.query);
      if (!result.success) {
        return res.status(400).json({
          message: result.error.issues.map((e) => e.message).join(', '),
        });
      }
      res.locals.query = result.data;
      next();
    };
  }
}

export const validation = new Validation();
