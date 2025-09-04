import express from "express";
import { prisma } from "../utils/prisma.util.js";
import authMiddleware from '../middlewares/auth.middleware.js'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// 회원가입
router.post('/signup', async(req, res, next) => {
    try {
        const { email, password, confirmPassword, nickname } = req.body;

        // 유효성 검사
        if (!email || !password || !confirmPassword || !nickname) {
            return res.status(400).json({ message: "모든 필드 입력해주세요."});
        }
        if (password.length < 6) {
            return res.status(400).json( { message: "비밀번호는 6자리 이상이어야 합니다."});
        }
        if (password !==confirmPassword) {
            return res.status(400).json({ message: "비밀번호를 확인해주세요"});
        }
        
        // 이메일, 닉네임 중복 확인
        const isExistUser = await prisma.user.findFirst( {
            where: {
                OR: [{ email }, { nickname }],
            },
        });
        if (isExistUser) {
            return res.status(409).json( { message: "이미 사용중인 이메일 또는 닉네임 입니다."});
        }
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password,10);
        // 사용자 생성

        const user = await prisma.user.create({
            data: {
                email,
                nickname,
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            createdAt: user.createdAt,
        });
    } catch(err) {
        next(err);
    }
});

// 로그인
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 유효성 검사
        if(!email|| !password) {
            return res.status(400).json({ message: "이메일과 비밀번호를 모두 입력하세요."});
        }
        
        // 사용자 조회 (이메일)
        const user = await prisma.user.findFirst({ where: { email }});
        if (!user) {
            return res.status(401).json( { message: "인증 정보가 유효하지 않습니다."});
        }

        // 비밀번호 해싱
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(401).json( { message: "인증 정보가 유효하지 않습니다."});
        }

        // JWT 생성
        const accessToken = jwt.sign(
            { userId: user.id }, //payload: JWT에 담을 정보(사용자 ID)
            'custom-secret-key', // secretKey: JWT를 서명할 비밀키
            { expiresIn: '12h'} // 토큰의 유효시간 12시간으로 설정
        );

        // 클라이언트에게 Access Token 응답
        return res.status(200).json( { accessToken });
    } catch (err){
        next(err);
    }
});

router.get('/users/me', authMiddleware, async (req, res, next) => {
    try {
        //인증 미들웨어에서 req.user에 할당한 사용자 정보 사용
        const user = req.user;
        // 비밀번호 제외
        return res.status(200).json({
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch(err) {
        next(err);
    }
});

// 유저 정보 수정

router.put('/users/me', authMiddleware, async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const { nickname, image } = req.body;

        // 수정할 정보가 하나도 없는 경우
        if (!nickname && !image) {
            return res.status(400).json( { message: "수정할 정보를 입력해주세요."});
        }

        // 닉네임 수정할 때, 닉네임이 DB에 중복 되는지 확인
        if(nickname) {
            const isExistNickname = await prisma.user.findFirst({
                where: {
                    nickname,
                    // 자기 자신의 닉네임 중복 검사에서 제외
                    id: {not: userId},
                },
            });
            if(isExistNickname) {
                return res.status(409).json({ message: "이미 사용중인 닉네임입니다."});
            }
        }
        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data: {
                ...(nickname && { nickname }),
                ...(image && {image}),
            },
            // 비밀번호를 제외한 사용자 정보 수정
            select: {
                id: true,
                email: true,
                nickname: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return res.status(200).json({ data: updatedUser});
    } catch(err) {
        next(err);
    }
});

/** 비밀번호 변경 */
/**Q. 현재 비밀번호 변경 후에 전에 사용하던 비밀번호의 Token이 여전히 유효한데 
 * 전에 사용하던 토큰을 삭제하고 새로 발급된 Token만 유효하게 하려면 어떻게 개발을 하면될까요???
 */
router.put('/users/me/password', authMiddleware, async (req, res, next) => {
    try{
        const {id: userId } = req.user;
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        // 유효성 검사
        if(!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: "모든 필드 입력해주세요"});
        }
        if(newPassword.length < 6) {
            return res.status(400).json({ message: "새로운 비밀번호는 6자 이상 작성해야합니다."});
        }
        if(newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "새로운 비밀번호 일치하지 않습니다."});
        }
        // 현재 비밀번호 확인
        const user = await prisma.user.findUnique( {where: {id: userId}});
        const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordMatched) {
            return res.status(401).json( { message: "현재 비밀번호가 일치하지 않습니다."});
        }

        // 새로운 비밀번호와 현재 비밀번호 중복 확인
        if (currentPassword === newPassword) {
            return res.status(400).json({ message: "새로운 비밀번호와 현재 비밀번호가 같습니다."});
        }
        // 새로운 비밀번호 해싱 및 업데이트
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        return res.status(200).json({ message: "비밀번호가 성공적으로 변경되었습니다."});
    } catch(err){
        next(err);
    }
});

/** 특정 유저가 등록한 상품 목록 조회 */
router.get('/users/me/products', authMiddleware, async(req, res, next) => {
    try{
        const { id: userId } = req.user;

        const products = await prisma.product.findMany({
            where: { authorId: userId },
            orderBy: {
                createdAt: 'desc', // 최신순
            },
        });
        return res.status(200).json({ data: products });
    } catch(err) {
        next(err);
    }
});
export default router;