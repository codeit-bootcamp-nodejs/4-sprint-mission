import prisma from '../lib/prismaClient.js';
import bcrypt from 'bcrypt';

export const isOwner = (modelGetter) => async (req, res, next) => {
  const resource = await modelGetter(req);
  if (!resource)
    return res.status(404).json({ message: '대상을 찾을 수 없습니다.' });
  if (resource.userId !== req.user.id)
    return res.status(403).json({ message: '권한이 없습니다.' });
  next();
};

export const isProductOwner = isOwner((req) =>
  prisma.product.findUnique({
    where: { id: parseInt(req.params.id) },
    select: { userId: true },
  })
);

export const isArticleOwner = isOwner((req) =>
  prisma.article.findUnique({
    where: { id: parseInt(req.params.id) },
    select: { userId: true }, // 반드시 userId 포함
  })
);

export const isCommentOwner = isOwner((req) =>
  prisma.comment.findUnique({
    where: { id: parseInt(req.params.id) },
    select: { userId: true },
  })
);

export const isUserSelf = async (req, res, next) => {
  const userId = parseInt(req.params.userId);

  if (userId !== req.user.id) {
    return res.status(403).json({ message: '권한이 없습니다.' });
  }

  next();
};

export const verifyPassword = async (req, res, next) => {
  const { currentPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ message: '현재 비밀번호를 입력해 주세요.' });
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const isValid = await bcrypt.compare(currentPassword, user.password);

  if (!isValid) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  }

  next();
};
