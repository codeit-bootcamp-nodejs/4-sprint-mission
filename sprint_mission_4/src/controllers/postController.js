import express from 'express';
import passport from '../config/passport.js';
import postService from '../services/postService.js';

const controller = express.Router();

//로그인한 유저만 게시글을 등록 가능
controller.post('/',
    passport.authenticate('access-token', { session: false }),
    async (req, res, next) => {
        try {
            const userId = req.user.id;
            const postData = req.body;
            const post = await postService.createPost(postData, userId);
            return res.status(200).json(post);
        } catch (error) {
            next(error);
        }
    })

// 게시글을 등록한 유저만 해당 게시글을 수정
controller.patch('/:postId',
    passport.authenticate('access-token', { session: false }),
    async (req, res, next) => {
        try {
            const userId = req.user.id;
            const postData = req.body;
            const postId = parseInt(req.params.postId, 10);
            await postService.updatePost(userId, postData, postId);
            res.status(200).json({ message: 'Post updated successfully.' })
        } catch (error) {
            next(error);
        }
    })


//삭제
controller.delete('/:postId',
    passport.authenticate('access-token', { session: false }),
    async (req, res, next) => {
        try {
            const userId = req.user.id;
            const postId = parseInt(req.params.postId, 10);
            await postService.deletePost(postId, userId);
            res.status(200).json({ message: "Product deleted successfully" });
        } catch (error) {
            next(error);
        }
    })

export default controller;