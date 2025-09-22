import prisma from "../../../lib/prisma.js";

export default async function getUserProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        email: true,
        nickname: true,
        image: true,
        myProducts: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
    });

    res.status(200).json({
      data: { ...user },
    });
  } catch (err) {
    next(err);
  }
}
