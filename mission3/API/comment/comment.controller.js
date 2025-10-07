import { PrismaClient } from "@prisma/client";
import { findUniqueCommentId } from "./comment.service";

const prisma = PrismaClient();

// comment list access API
export const getCommentList = async (req, res) => {
  const { type, page, take } = req.query;

  // pagenation
  const takeNumber = parseInt(take);
  const pageNumber = parseInt(page);
  const skip = (pageNumber - 1) * takeNumber;

  const whereFields =
    type === "MARKET" ? { productId: Number(id) } : { articleId: Number(id) };

  const includeFields =
    type === "MARKET" ? { product: true } : { article: true };

  console.log("incomming request data : ", req.query);
  try {
    const commentList = await prisma.comment.findMany({
      where: whereFields,
      include: includeFields,
      take: { takeNumber },
      skip,
    });

    res.status(200).json({
      message: "succefully access your comment",
      data: commentList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

// access comment by API
export const getComment = async (req, res) => {
  const id = Number(req.params.id);
  const uniqueComment = await findUniqueCommentId(id);

  if (!uniqueComment)
    return res.status(404).json({ error: "duplicated comment_id" });

  console.log("incomming data : ", uniqueComment);
  try {
    return res.status(200).json({
      message: "successfully access the comment",
      data: uniqueComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

// create comment API
export const createdComment = async (req, res) => {
  const { content, title, articleId, productId } = req.body;
  const { type } = req.query;

  console.log("requet body : ", req.body);
  console.log("type:", type);

  const connectedData =
    type === "MARKET"
      ? { product: { connect: { productId } } }
      : { articleId: { connect: { articleId } } };

  console.log("incomming data : ", req.body)
  try {
    const newComment = await prisma.comment.create({
      date: {
        title,
        content,
        type: type,
        ...connectedData, // explicit relation with product and product and article
        createdAt: new Date(),
      },
    });
    res.status(201).json({
      message: "successfully create data",
      data: newComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

// update API
export const updatedComment = async (req, res) => {
  const id = Number(req.params.id);
  const uniqueComment = await findUniqueCommentId(id);
  const { title, content } = req.body;

  if (!uniqueComment)
    return res.status(404).json({ error: "Duplicated commentId" });

  try {
    const modifiedComment = await prisma.comment.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    res.status(200).json({
      message: "succefully update user comment",
      data: modifiedComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

// Delete API
export const deleteComment = async (req, res) => {
  const id = Number(req.params.id);
  const uniqueComment = await findUniqueCommentId(id);
  if (!uniqueComment)
    return res.status(404).json({ error: "Duplicated commentId" });

  try {
    await prisma.comment.delete({ where: { id } });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};
// fork upstream 설정 해야  // 원본저장소 주소/// 있어야 할 커밋이 없는경우 (뿌리가 다른경우)=> push x