import { prisma } from '../../lib/prismaClient.js';
import AppError from '../../lib/appError.js';
import { commentRepository } from './comment-repo.js';
class ArticleCommentService {
    // 공통 로직 조합
    updateComment = commentRepository.updateComment;
    deleteComment = commentRepository.deleteComment;
    commentLike = commentRepository.like;
    commentUnlike = commentRepository.unlike;
    // 게시글의 댓글 조회
    async getCommentsByArticleId(articleId, userId) {
        const comments = await prisma.comment.findMany({
            where: { articleId, productId: null },
            include: {
                user: { select: { username: true } },
                likedBy: {
                    select: { id: true },
                    ...(userId && { where: { id: userId } }),
                },
            },
        });
        if (!comments.length)
            throw new AppError('해당 게시글의 댓글을 찾을 수 없습니다.', 404);
        return comments.map((c) => ({
            ...c,
            isLiked: c.likedBy?.length > 0 || false,
            likeCount: c.likeCount,
        }));
    }
    // 게시글 댓글 작성
    async createArticleComment(articleId, content, userId) {
        return prisma.comment.create({
            data: {
                content,
                user: { connect: { id: userId } },
                article: { connect: { id: articleId } },
            },
        });
    }
}
export const articleCommentService = new ArticleCommentService();
//# sourceMappingURL=article-cmt-service.js.map