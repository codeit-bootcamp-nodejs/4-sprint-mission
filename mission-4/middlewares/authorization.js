import prisma from '../lib/prisma.js';

export default function authorization(domain) {
  return async (req, res, next) => {
    try {
      const id = req.parsedId;
      const { id: idFromToken } = req.tokenPayload;
      const data = await prisma[domain].findUniqueOrThrow({
        where: id,
        select: {
          userId: true,
        },
      });
      if (idFromToken !== data.userId) {
        const err = new Error('권한이 없습니다.');
        err.statusCode = 403; // 403 Forbidden
        throw err;
      }
      next();
    } catch (e) {
      console.error(e);
      next(e);
    }
  };
}
