import express from 'express';
import prisma from '../lib/prisma.js';
import auth from '../../dist/middlewares/auth.js';
const router = express.Router();
// 상품 댓글 생성
router.post('/product/:productId', auth, async (req, res) => {
    const userId = req.userId;
    const { productId } = req.params;
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: '댓글 필요' });
    }
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
        return res.status(404).json({ error: '제품을 찾을 수 없음' });
    }
    const comment = await prisma.comment.create({
        data: { content, authorId: userId, productId },
    });
    res.status(201).json({ comment });
});
// 게시글 댓글 생성
router.post('/post/:postId', auth, async (req, res) => {
    const userId = req.userId;
    const { postId } = req.params;
    const { content } = req.body;
    if (!content)
        return res.status(400).json({ error: 'content required' });
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post)
        return res.status(404).json({ error: 'Post not found' });
    const comment = await prisma.comment.create({
        data: { content, authorId: userId, postId },
    });
    res.status(201).json({ comment });
});
// 댓글 수정
router.patch('/:id', auth, async (req, res) => {
    const userId = req.userId;
    const commentId = req.params.id;
    const { content } = req.body;
    if (!content)
        return res.status(400).json({ error: 'content required' });
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment)
        return res.status(404).json({ error: 'Comment not found' });
    if (comment.authorId !== userId)
        return res.status(403).json({ error: 'Not authorized' });
    const updated = await prisma.comment.update({ where: { id: commentId }, data: { content } });
    res.json({ comment: updated });
});
// 댓글 삭제
router.delete('/:id', auth, async (req, res) => {
    const userId = req.userId;
    const commentId = req.params.id;
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment)
        return res.status(404).json({ error: 'Comment not found' });
    if (comment.authorId !== userId)
        return res.status(403).json({ error: 'Not authorized' });
    await prisma.comment.delete({ where: { id: commentId } });
    res.json({ message: 'Comment deleted' });
});
export default router;
//# sourceMappingURL=comments.js.map