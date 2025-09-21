import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.util.js";

export default async function(req: Request, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json( { message: "인증 정보가 없습니다."});
        }

        const [tokenType, token] = authorization.split(' ');
        if (tokenType !== "Bearer") {
            return res.status(401).json( { message: "지원하지 않는 토큰 형식입니다."});
        }

        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET_KEY;
        if (!accessTokenSecret) {
            return res.status(500).json({ message: "서버에 ACCESS_TOKEN_SECRET_KEY가 설정되지 않았습니다." });
        }

        const decodedToken = jwt.verify(token, accessTokenSecret);

        if (typeof decodedToken !== 'object' || decodedToken === null || !('userId' in decodedToken)) {
            return res.status(401).json({ message: "인증 정보가 유효하지 않습니다." });
        }
        
        const userId = (decodedToken as { userId: number }).userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if(!user) {
            return res.status(401).json( { message: "인증정보와 일치하는 사용자가 없습니다."});
        }

        req.user = user;
        next();
    } catch(err: any){
        if(err.name === "TokenExpiredError") {
            return res.status(401).json( { message: "인증 정보 만료"});
        }
        else if( err.name === "JsonWebTokenError") {
            return res.status(401).json( { message: "인증 정보가 유효하지 않습니다."});
        }
        next(err);
    }
}