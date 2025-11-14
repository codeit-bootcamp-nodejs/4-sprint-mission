//src/controllers/post_controller.ts
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

class PostController {
  async getPosts(req: Request, res: Response) {
    try {
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, nickname: true, email: true } },
          _count: { select: { comments: true } },
        },
      });
      res.status(200).json(posts);
    } catch (error) {
      console.error('게시글 목록 조회 오류:', error);
      res.status(500).json({ error: '게시글 목록 조회에 실패했습니다.' });
    }
  }

  async getPostById(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: { select: { id: true, nickname: true, email: true } },
        },
      });

      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      res.status(200).json(post);
    } catch (error) {
      console.error('게시글 조회 오류:', error);
      res.status(500).json({ error: '게시글 조회에 실패했습니다.' });
    }
  }

  async createPost(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { title, content, imageUrl } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: '제목과 내용을 입력해주세요.' });
      }

      const post = await prisma.post.create({
        data: {
          title,
          content,
          imageUrl: imageUrl || null,
          authorId: userId
        },
      });

      res.status(201).json(post);
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      res.status(500).json({ error: '게시글 작성에 실패했습니다.' });
    }
  }

  async updatePost(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const postId = parseInt(req.params.id);
      const { title, content, imageUrl } = req.body;

      const existingPost = await prisma.post.findUnique({
        where: { id: postId }
      });

      if (!existingPost) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      if (existingPost.authorId !== userId) {
        return res.status(403).json({ error: '수정 권한이 없습니다.' });
      }

      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          ...(title && { title }),
          ...(content && { content }),
          ...(imageUrl !== undefined && { imageUrl }),
        },
      });

      res.status(200).json(updatedPost);
    } catch (error) {
      console.error('게시글 수정 오류:', error);
      res.status(500).json({ error: '게시글 수정에 실패했습니다.' });
    }
  }

  async deletePost(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const postId = parseInt(req.params.id);

      const existingPost = await prisma.post.findUnique({
        where: { id: postId }
      });

      if (!existingPost) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      if (existingPost.authorId !== userId) {
        return res.status(403).json({ error: '삭제 권한이 없습니다.' });
      }

      await prisma.post.delete({ where: { id: postId } });
      res.status(204).send();
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      res.status(500).json({ error: '게시글 삭제에 실패했습니다.' });
    }
  }
}

export default new PostController();