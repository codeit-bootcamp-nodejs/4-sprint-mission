  import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();
const typeList = ["market", "article"];

// accessing comment list
router.get("/", async (req, res) => {
  const { type, page, id } = req.query;
  const take = 10;
  const pageNumber = parseInt(page) || 1; // convert pagenumber as int
  const skip = (pageNumber - 1) * take; // cursor pagination

  if (!typeList.includes(type))
    return res.status(400).json({ error: "check the type" });

  if (skip < 0) {
    return res
      .status(404)
      .json({ error: " the skip number cannot be negative" });
  }

  // determine the key name based on "type" value.
  // use bracket notion to assign dynamic objecy key
  //  Build prisma "where" filter dynamically
  const whereFields =
    type === "MARKET" ? { productId: Number(id) } : { articleId: Number(id) };
  const includeFields =
    type === "MARKET" ? { product: true } : { article: true };

  try {
    const comments = await prisma.comment.findMany({
      where: whereFields,
      include: includeFields,
      skip,
      take,
    });
    console.log("accessing results :", comments);
    res.status(200).json({
      message: "success for accessing the comments",
      data: comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});

// registering comment
router.post("/", async (req, res) => {
  const { content, title, id, articleId, productId } = req.body;
  const { type } = req.query;
  const upperChar = type?.toUpperCase(); // convert lowest case of char to upper

  const connectedData =
    //if the character is market which is uppercase,
    //connect with productID field
    upperChar === "MARKET"
      ? { product: { connect: { productId } } }
      : { article: { connect: { articleId } } };

  console.log("post request", "requesting body :", req.body, "type : ", type);
  console.log("id:", id, "Number(id):", Number(id));

  // prunning
  if (!typeList.includes(upperChar))
    return res.status(400).json({ error: "check the type in the post" });
  if (!content || !title)
    return res
      .status(404)
      .json({ error: "please chech content or title on your comment" });

  try {
    const newComment = await prisma.comment.create({
      data: {
        title,
        content,
        type: upperChar,
        ...connectedData,
      },
    });

    console.log("result of request from post", newComment);
    res.status(201).json({
      message: "success for post",
      data: newComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

// common function for tracking unique id
const getCommentById = async (id) => {
  return prisma.comment.findUnique({ where: { id } });
};

// modifying comment
router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, content } = req.body;
  const comment = await getCommentById(id);
  console.log("patching method requested:", req.body);

  if (!comment) return res.status(404).json({ error: "comment not found" });

  if (isNaN(id)) return res.status(400).json({ error: "Invalid comment ID" }); // check id is integer.

  try {
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        title,
        content,
      },
    });
    res.status(200).json({
      message: "success updating the comment",
      data: updatedComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});

// remove comment
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const comment = await getCommentById(id);

  if (!comment) return res.status(404).json({ error: "Not found comment ID" });

  console.log("delete method requested :", "id:", req.params.id);

  try {
    await prisma.comment.delete({ where: { id } }); // remove the index commemt
    res.status(200).json({ message: "success for deleting comment" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});

export default router;
