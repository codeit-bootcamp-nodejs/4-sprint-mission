import express from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
// 회원가입
async function register(req, res) {
    const { email, nickname, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
        data: { email, nickname, password: hashedPassword },
    });
    // 응답시 password 제거
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
}
;
// 로그인
async function login(req, res) {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!email) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
}
;
async function logout(req, res) {
    req.session.destroy();
    res.status(200).send();
}
export default router;
//# sourceMappingURL=authRoutes.js.map