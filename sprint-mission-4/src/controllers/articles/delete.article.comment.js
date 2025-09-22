import prisma from "../../../lib/prisma.js";

const deleteArticleComment = async (req, res, next) => {
  const reqId = Number(req.params.id);

  try {
    await prisma.comment.delete({
      where: { id: reqId, ownerId: req.user.id },
    });

    res.status(200).json({ message: "Delete Success" });
  } catch (err) {
    next(err);
  }
};

export default deleteArticleComment;
