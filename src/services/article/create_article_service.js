import prisma from "../prisma.js";

export async function createArticleService({ title, content, user }) {
  try {
    const article = await prisma.article.create({
      data: { title, content, userId: user.id },
    });
    return article;
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
