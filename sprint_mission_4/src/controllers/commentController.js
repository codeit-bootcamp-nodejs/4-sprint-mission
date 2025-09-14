import express from 'express';
import passport from '../config/passport.js';
import commentService from '../services/commentService.js';

const controller = express.Router();

// 로그인한 유저만 상품에 댓글을 등록 가능
controller.post('/products/:productId',
    passport.authenticate('access-token', { session: false }),
    async (req, res, next) => {
        try {
            const userId = req.user.id;
            const productId = parseInt(req.params.productId, 10);
            const commentByProductData = req.body;
            const commentByProduct = await commentService.createCommentByProduct(commentByProductData, productId, userId);
            return res.status(200).json(commentByProduct);
        } catch (error) {
            next(error);
        }
    })

// 로그인한 유저만 게시글에 댓글을 등록 가능
controller.post('/posts/:postId',
    passport.authenticate('access-token', { session: false }),
    async (req, res, next) => {
        try {
            const userId = req.user.id;
            const postId = parseInt(req.params.postId, 10);
            const commentByPostData = req.body;
            const commentByPost = await commentService.createCommentByPost(commentByPostData, postId, userId);
            return res.status(200).json(commentByPost);
        } catch (error) {
            next(error);
        }
    })

// 댓글을 등록한 유저만 해당 댓글을 수정 or 삭제 가능

controller.patch('/:commentId',
    passport.authenticate('access-token', { session: false }),
    async (req, res, next) => {
        try {
            const userId = req.user.id;
            const commentId = parseInt(req.params.commentId);
            const commentData = req.body;
            await commentService.updateComment(commentData, commentId, userId);
            return res.status(200).json({ message: "Comment updated successfully" })
        } catch (error) {
            next(error);
        }
    })

controller.delete('/:commentId',
    passport.authenticate('access-token', { session: false }),
    async (req, res, next) => {
        try {
            const userId = req.user.id;
            const commentId = parseInt(req.params.commentId);
            await commentService.deleteComment(commentId, userId);
            return res.status(200).json({ messags: "Comment deleted successfully" })
        } catch (error) {
            next(error);
        }
    })

export default controller;