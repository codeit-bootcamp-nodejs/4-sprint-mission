import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';

const router = Router();
const userController = new UserController();

// 사용자 관련 라우트
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;