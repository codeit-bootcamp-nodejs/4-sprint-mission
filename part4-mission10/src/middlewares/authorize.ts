import bcrypt from 'bcrypt';
import type { Request, RequestHandler } from 'express';

import { prisma } from '../lib/prismaClient.js';

// params에 어떤 키들이 올 수 있는지 제네릭으로 지정.
type Params = { id?: string; commentId?: string; userId?: string };

// modelGetter는 req를 받아서 userId를 포함한 리소스를 반환(또는 null)
type ModelGetter = (req: Request<Params>) => Promise<{ userId: number } | null>;

// 공통 로직
export const isOwner = (modelGetter: ModelGetter): RequestHandler => {
  return async (req, res, next) => {
    const resource = await modelGetter(req as Request<Params>);
    if (!resource)
      return res.status(404).json({ message: '대상을 찾을 수 없습니다.' });
    const reqUserId = (req.user as { id?: number } | undefined)?.id;
    if (typeof reqUserId !== 'number') {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    if (resource.userId !== reqUserId)
      return res.status(403).json({ message: '권한이 없습니다.' });
    next();
  };
};

// 제품 권한 체크
export const isProductOwner = isOwner((req) =>
  prisma.product.findUnique({
    where: { id: parseInt((req.params.id ?? '') as string, 10) || 0 },
    select: { userId: true },
  })
);

// 게시글 권한 체크
export const isArticleOwner = isOwner((req) =>
  prisma.article.findUnique({
    where: { id: parseInt((req.params.id ?? '') as string, 10) || 0 },
    select: { userId: true },
  })
);

// 댓글 권한 체크
export const isCommentOwner = isOwner((req) =>
  prisma.comment.findUnique({
    where: { id: parseInt((req.params.commentId ?? '') as string, 10) || 0 },
    select: { userId: true },
  })
);

// 본인인지 체크
export const isUserSelf: RequestHandler = (req, res, next) => {
  // :userId 또는 :id 둘 다 지원
  const targetIdRaw = (req.params.userId ?? req.params.id) as
    | string
    | undefined;
  const targetId = Number.parseInt(targetIdRaw ?? '', 10);

  const reqUserId = (req.user as { id?: number } | undefined)?.id;

  if (typeof reqUserId !== 'number') {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }

  // 파라미터가 없거나 숫자가 아니면 권한 없음으로 처리(요구사항에 따라 400으로 바꿀 수도 있음)
  if (!Number.isFinite(targetId) || targetId !== reqUserId) {
    return res.status(403).json({ message: '권한이 없습니다.' });
  }

  next();
};

// 비밀번호 체크
export const verifyPassword: RequestHandler = async (req, res, next) => {
  try {
    const { currentPassword } = req.body as { currentPassword?: string };
    if (!currentPassword) {
      return res
        .status(400)
        .json({ message: '현재 비밀번호를 입력해 주세요.' });
    }

    const reqUserId = (req.user as { id?: number } | undefined)?.id;
    if (typeof reqUserId !== 'number') {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const user = await prisma.user.findUnique({ where: { id: reqUserId } });
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    next();
  } catch (err) {
    next(err);
  }
};
