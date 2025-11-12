// src/controllers/comment_controller.ts
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import notificationService from '../services/notification_service';

class CommentController {
    async createComment(req: Request, res: Response) {
        try {
            const userId = req.user?.id || parseInt(req.body.userId); // 테스트용
            const postId = parseInt(req.params.postId);
            const { content } = req.body;

            if (!content || content.trim().length === 0) {
                return res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
            }

            const comment = await prisma.comment.create({
                data: {
                    content,
                    authorId: userId,
                    postId,
                },
            });

            await notificationService.notifyNewComment(postId, userId, content);

            res.status(201).json(comment);
        } catch (error: any) {
            console.error('댓글 작성 실패:', error);
            if (error.message === '게시글을 찾을 수 없습니다.') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: '댓글 작성에 실패했습니다.' });
        }
    }
}

export default new CommentController();