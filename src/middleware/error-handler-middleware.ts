import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(error);

  if (error.code === 'P2025') {
    return res.status(404).json({ error: '요청한 자원을 찾을 수 없습니다.' });
  }

  if (error.code === 'P2002' && error.meta?.target) {
    const field = (error.meta.target as string[])[0];
    return res.status(409).json({ error: `${field} 필드가 이미 존재합니다.` });
  }

  res
    .status(500)
    .json({ error: '서버 내부의 예상치 못한 오류가 발생했습니다.' });
};