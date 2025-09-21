import { Request, Response } from 'express';
import { PostService } from '@/services/post.service';
import { CreatePostDto, UpdatePostDto } from '@/dto/post.dto';

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  // 모든 포스트 조회
  getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.postService.getAllPosts();
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' 
      });
    }
  };

  // ID로 포스트 조회
  getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: '유효하지 않은 포스트 ID입니다.' });
        return;
      }

      const post = await this.postService.getPostById(id);
      
      if (!post) {
        res.status(404).json({ error: '포스트를 찾을 수 없습니다.' });
        return;
      }

      res.json(post);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' 
      });
    }
  };

  // 사용자 ID로 포스트 조회
  getPostsByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({ error: '유효하지 않은 사용자 ID입니다.' });
        return;
      }

      const result = await this.postService.getPostsByUserId(userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' 
      });
    }
  };

  // 포스트 생성
  createPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const createPostDto: CreatePostDto = req.body;

      if (!createPostDto.title || !createPostDto.content || !createPostDto.userId) {
        res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
        return;
      }

      const post = await this.postService.createPost(createPostDto);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof Error && error.message.includes('존재하지 않는')) {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(400).json({ 
        error: error instanceof Error ? error.message : '잘못된 요청입니다.' 
      });
    }
  };

  // 포스트 수정
  updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: '유효하지 않은 포스트 ID입니다.' });
        return;
      }

      const updatePostDto: UpdatePostDto = req.body;
      const post = await this.postService.updatePost(id, updatePostDto);

      if (!post) {
        res.status(404).json({ error: '포스트를 찾을 수 없습니다.' });
        return;
      }

      res.json(post);
    } catch (error) {
      if (error instanceof Error && error.message.includes('존재하지 않는')) {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(400).json({ 
        error: error instanceof Error ? error.message : '잘못된 요청입니다.' 
      });
    }
  };

  // 포스트 삭제
  deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: '유효하지 않은 포스트 ID입니다.' });
        return;
      }

      const deleted = await this.postService.deletePost(id);

      if (!deleted) {
        res.status(404).json({ error: '포스트를 찾을 수 없습니다.' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' 
      });
    }
  };
}