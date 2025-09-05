import bcrypt from 'bcrypt'
import prisma from 'lib/prisma.js'
import jsonWebToken from '../lib/json-web-token.js';
import userService from '../service/user-service.js';

class UserController{
    //회원가입 유효성 검사 필요
    register = async(req,res,next) => {
        const {email, nickname, password} = req.body;
        
        const newUser = userService.createUser({
            email,nickname,password})

        return newUser
    }

    login = async(req,res,next) => {
        const {email, password} = req.body;
        const user = await prisma.user.findUnique({
            where:{email}
        });

        const accessToken = userService.loginAndGiveToken({
            email, password
        })
        return accessToken
    }

    getUser = async(req,res,next) => {
        const user = req.user ;

        //비밀번호 빼기

        return user
    }

    patchUser = async(req,res,next) => {
        const {nickname, image} = req.body;
        const userId = Number(req.user.id);
        const patchUser = await prisma.user.update({
            where:{id:userId},
            data:{nickname,image}
        })
        return patchUser
    }

    patchPassword = async(req,res,next) => {
        const {password} = req.body;
        const userId = Number(req.user.id);
        const patchUser = await prisma.user.update({
            where:{id:userId},
            data:{password}
        })
        return patchUser
    }

    getUserProduct = async(req,res, next) => {
        const userId = Number(req.params.userId);
        const user = prisma.user.findUnique({
            where:{id: userId},
            include:{product:true}
        })
        const userProduct = user.product

        return userProduct
    }

    getLikedProduct = async(req, res, next) => {
        const user = req.user

        //likeModels는 유저, product의 정보를 가진 좋아요 모델의 list 
        const likedModels = user.productLike;
        //like models를 바탕으로 현재 로그인 한 유저가 좋아요 한 product들을 가져옵니다
        const likedProducList = await userService.likedProdcut(likedModels)

        return likedProducList
    }
}

export default new UserController();