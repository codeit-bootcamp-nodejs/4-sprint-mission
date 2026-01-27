import { prisma } from "../prisma/client.js";
import { CreatePostDto, UpdatePostDto } from "../validations/schemas.js";

export async function createPost(req, res) {
  const body = CreatePostDto.parse(req.body);
  const post = await prisma.post.create({
    data: { ...body, userId: req.user.id },
  });
  return res.status(201).json(post);
}

export async function listPosts(req, res) {
  const posts = await prisma.post.findMany({ include: { user: true } });
  return res.json(posts);
}

export async function getPost(req, res) {
  const id = parseInt(req.params.id);
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
      likes: { where: { userId: req.user?.id } },
    },
  });
  if (!post) return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });

  return res.json({
    ...post,
    isLiked: post.likes.length > 0,
  });
}

export async function updatePost(req, res) {
  const id = parseInt(req.params.id);
  const body = UpdatePostDto.parse(req.body);
  const post = await prisma.post.update({ where: { id }, data: body });
  return res.json(post);
}

export async function deletePost(req, res) {
  const id = parseInt(req.params.id);
  await prisma.post.delete({ where: { id } });
  return res.json({ message: "삭제되었습니다." });
}
