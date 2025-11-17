import { NextFunction, Request,Response } from "express"
import { AuthService } from "./auth.service";

const authService = new AuthService();
export interface RequestUserBody{
    nickname: string,
    password: string,
    emaill: string
}

export class AuthController{
    async createUserCont(req:Request, res:Response, next:NextFunction){
        try {
            const {nickname, password, email} = req.body;
            const newUser = await authService.createUser({nickname, password, email})
            return res.json({success:true, data:newUser})
        } catch (error) {
           next(error)
       }
    }

    async loginUserCont(req:Request, res:Response, next:NextFunction){
        try {
            const {nickname, password, email} = req.body;
            const login = await authService.loginUser({nickname, password, email})
            next(login)
            return res.json({success:true})
        } catch (error) {
           next(error)
        }
    }

}