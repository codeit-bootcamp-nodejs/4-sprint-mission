import express from 'express';
import passport from '../config/passport.js';
import userService from "../services/userService.js";
import productService from '../services/productService.js';

const controller = express.Router();

// 회원가입 
controller.post('/register', async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        return res.status(201).json(user);
    } catch (error) {
        next(error);
    }
})

//로그인
controller.post('/login',
    passport.authenticate('local', { session: false }),
    async (req, res, next) => {
        try {
            const user = req.user;
            const accessToken = await userService.createToken(user);
            const refreshToken = await userService.createToken(user, 'refresh');
            await userService.updateUser(user.id, { refreshToken });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });
            return res.status(200).json({ "token": accessToken });
        } catch (error) {
            next(error);
        }
    })



// 유저가 자신의 정보를 조회 기능
controller.get('/',
    passport.authenticate('access-token', { session: false }),
    async (req, res, next) => {
        try {
            const userId = req.user.id;
            const user = await userService.getUserId(userId);
            return res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    })

// 유저가 자신의 정보를 수정 기능
controller.patch('/:userId',
    passport.authenticate('access-token', { session: false }),
    async (req, res, next) => {
        try {
            const userId = req.user.id;
            const userData = req.body;
            const updatedUser = await userService.updateUser(userId, userData);
            return res.status(200).json({ message: 'User updated successfully.' });
        } catch (error) {
            next(error);
        }
    })

// 유저가 자신의 비밀번호를 변경 기능
controller.patch('/:userId',
    passport.authenticate('access-token', { session: false }),
    async (req, res, next) => {
        try {
            const userId = req.user.id;
            const userPassword = req.body.password;
            await userService.updatePassword(userId, userPassword);
            return res.status(200).json({ message: "User Passqord updated successfully." })
        } catch (error) {
            next(error);
        }
    })

// 유저가 자신이 등록한 상품의 목록을 조회 기능
controller.get('/:userId/product',
    passport.authenticate('access-token', { session: false }),
    async (req, res, next) => {
        try {
            const userId = req.user.id;
            const userProducts = await userService.getUserProducts(userId);
            return res.status(200).json(userProducts);
        } catch (error) {
            next(error);
        }
    })


export default controller;