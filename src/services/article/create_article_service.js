import prisma from "../prisma.js";

export async function createArticleService({ title, content }) {
  try {
    const article = await prisma.article.create({
      data: { title, content },
    });
    return article;
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
