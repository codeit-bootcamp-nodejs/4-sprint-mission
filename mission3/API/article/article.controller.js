import { PrismaClient } from "@prisma/client";
import { findUniqueArticle } from "./article.service.js";

const prisma = new PrismaClient();

export const getArticles = async (req, res) => {
  const { page, take, title, content, keyword } = req.query;

  //pagenation
  const pageNumber = Number(page) || 1;
  const takeNumber = Number(take) || 10;
  const skip = (pageNumber - 1) * takeNumber;


  // searching form 
  const whereCondition = keyword 
    ? {
        OR: [
          { title: { contains: keyword,  mode: "insensitive"  }},
          { content: { contains: keyword,  mode: "insensitive" }} ,
        ],
      }
    : {};

  try {
    const articlesList = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: takeNumber,
      where: whereCondition,
    });

    res.status(200).json({
      message: "success for accessing list",
      data: articlesList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

export const getArticlesById = async (req, res) => {
  const id = Number(req.params.id);

  // validation for duplication
  const uniqueArticle = await findUniqueArticle(id);
  if (!uniqueArticle) return res.status(404).json({ error: "not found" });

  try {
    return res.status(200).json(uniqueArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

export const createArticle = async (req, res) => {
  const { title, content, name } = req.body;

  try {
    const newArticle = await prisma.article.create({
      data: {
        name,
        title,
        content,
        createdAt: new Date(),
      },
    });

    res
      .status(201)
      .json({ message: "success creating article", data: newArticle });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

export const modifyArticle = async (req, res) => {
  const { title, content } = req.body;
  const id = Number(req.params.id);
  const uniqueArticle = await findUniqueArticle(id);

  if (!uniqueArticle) return res.status(404).json({ error: "not found" });

  try {
    const modifiedArticle = await prisma.article.update({
      where: {
        id: uniqueArticle.id,
      },
      data: {
        title,
        content,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: "success updation article",
      data: modifiedArticle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

export const removeArticle = async (req, res) => {
  const id = Number(req.params.id);
  const uniqueArticle = await findUniqueArticle(id);

  if (!uniqueArticle) return res.status(404).json({ error: "not found" });
  try {
    await prisma.article.delete({
      where: {
        id: uniqueArticle.id,
      },
    });

    res.status(200).json({
      message: "success for deleting your post",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};
