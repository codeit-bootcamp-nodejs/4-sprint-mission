import bcrypt from 'bcrypt'
import prisma from '../lib/prisma'
import jsonWebToken from '../lib/json-web-token';
import userService from '../service/user-service';
import type { Request, Response, NextFunction } from 'express';


export interface User{
    id: number,
    password: string,
    image: string,
    email: string,
}


export class UserController{
    //회원가입 유효성 검사 필요
    register = async(req: Request,res: Response,next: NextFunction) => {
        try{
            const {email, nickname, password, image} = req.body;
        
            const newUser = await userService.createUser({
                email,nickname,password, image})
            const formatUser = await userService.formatUser(newUser)
            return res.send(formatUser)
        }catch(error){
             console.error(error)
            res.send(error)
        }
        
    }

    login = async(req: Request,res: Response,next: NextFunction) => {
        try{
            const {email, password} = req.body;
            const user = await prisma.user.findUnique({
                where:{email}
            });
            if (!user){
                throw new Error("no user")
            }

            const accessToken = await userService.loginAndGiveToken({email, password})
            console.log('access token: ', accessToken)
            res.send(accessToken) 
        }catch(error){
            console.error(error)
            res.send(error)
        }
        
    }

    getUser = async(req: Request,res: Response,next: NextFunction) => {
        try{
            const user = req.user ;
            return res.send(userService.formatUser(user))
        }catch(error){
            console.error(error)
            return res.send(error)
        }
        
    }

    patchUser = async(req: Request,res: Response,next: NextFunction) => {
        try{
            const {nickname, image} = req.body;
            const user:any = req.user
            const userId = Number(user.id);
            const patchUser = await prisma.user.update({
                where:{id:userId},
                data:{nickname,image}
            })
            return res.send(userService.formatUser(patchUser))
        }catch(error){
            console.error(error)
            return res.send(error)
        }
        
    }

    patchPassword = async(req: Request,res: Response,next: NextFunction) => {
        try{
            const {password} = req.body;
            const user:any = req.user
            const userId = Number(user.id);
            const patchUser = await prisma.user.update({
                where:{id:userId},
                data:{password}
            })
            return res.send(userService.formatUser(patchUser))
        }catch(error){
            console.error(error)
            return res.send(error)
        }
    }

    getUserProduct = async(req: Request,res: Response,next: NextFunction) => {
        const userId = Number(req.params.userId);
        try{
            const user = prisma.user.findUnique({
                where:{id: userId},
                include:{product:true}
            })
            const userProduct = user.product

            return res.send(userProduct)
        }catch(error){
            console.error(error)
            return res.send(error)
        }

        
    }

    getLikedProduct = async(req: Request,res: Response,next: NextFunction) => {
        const user:any = req.user

        //likeModels는 유저, product의 정보를 가진 좋아요 모델의 list 
        const likedModels = user.productLike;
        //like models를 바탕으로 현재 로그인 한 유저가 좋아요 한 product들을 가져옵니다
        const likedProducList = await userService.likedProduct(likedModels)

        return res.send(likedProducList)
    }
}

export default new UserController();