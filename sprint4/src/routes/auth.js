//src/routes/auth.js

const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 인증이 필요하지 않은 엔드포인트
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// 인증이 필요한 엔드포인트
router.get('/me', authMiddleware, authController.getMyInfo);
router.put('/me', authMiddleware, authController.updateMyInfo);
router.put('/me/password', authMiddleware, authController.changePassword);

module.exports = router;