import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.util.js";

export default async function(req, res, next) {
    try {
        // 클라이언트로부터 쿠키 전달 받기
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json( { message: "인증 정보가 없습니다."});
        }
        // 쿠키 유효성 검증 (Bearer)
        const [tokenType, token] = authorization.split(' ');
        if (tokenType !== "Bearer") {
            return res.status(401).json( { message: "지원하지 않는 토큰 형식입니다."});
        }
        // 서버에서 발급한 JWT 맞는지 검증
        const decodedToken = jwt.verify(token, 'custom-secret-key');
        const userId = decodedToken.userId;

        // 사용자 조회(JWT의 userId)
        const user = await prisma.user.findFirst({
            where: { id: userId },
        });
        if(!user) {
            return res.status(401).json( { message: "인증정보와 일치하는 사용자가 없습니다."});
        }
        // req.user에 조회된 사용자 정보 할당
        req.user = user;
        next();
    } catch(err){
        if(err.name === "TokenExpiredError") {
            return res.status(401).json( { message: "인증 정보 만료"});
        }
        else if( err.name === "JsonWebTokenError") {
            return res.status(401).json( { message: "인증 정보가 유효하지 않습니다."});
        }
        next(err);
    }
}