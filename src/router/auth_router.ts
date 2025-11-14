//src/router/auth_router.ts
import { Router } from 'express';
import authController from '../controllers/auth_controller';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;