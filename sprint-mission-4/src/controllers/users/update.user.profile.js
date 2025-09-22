import prisma from "../../../lib/prisma.js";

const updateUserProfile = async (req, res, next) => {
  try {
    const result = await prisma.user.update({
      where: { id: req.user.id },
      data: req.body,
    });

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

export default updateUserProfile;
