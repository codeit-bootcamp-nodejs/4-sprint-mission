import express from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
// 회원가입
async function register(req, res) {
    try {
        const { email, nickname, password } = req.body;
        if (!email || !nickname || !password) {
            return res.status(400).json({ message: "모든 필드를 입력하세요." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await prisma.user.create({
            data: { email, nickname, password: hashedPassword },
        });
        const { password: _, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
    }
    catch (err) {
        console.error("회원가입 오류:", err);
        return res.status(500).json({ message: "회원가입 실패", error: err.message });
    }
}
// 로그인
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "이메일과 비밀번호를 입력하세요." });
        }
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const { password: _, ...userWithoutPassword } = user;
        return res.json({ message: "로그인 성공", user: userWithoutPassword });
    }
    catch (err) {
        console.error("로그인 오류:", err);
        return res.status(500).json({ message: "로그인 실패", error: err.message });
    }
}
async function logout(req, res) {
    try {
        if (req.session) {
            req.session.destroy((error) => {
                if (error) {
                    console.error("세션 삭제 오류:", error);
                }
            });
        }
        return res.status(200).send();
    }
    catch (err) {
        console.error("로그아웃 오류:", err);
        return res.status(500).json({ message: "로그아웃 실패", error: err.message });
    }
}
export default router;
//# sourceMappingURL=authRoutes.js.map