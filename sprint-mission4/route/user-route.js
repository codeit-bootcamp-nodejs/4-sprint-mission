import express from 'express';
import UserService from '../service/user-service.js';
import zod from '../middleware/zod.js';
import token from '../middleware/token.js';


const router = express.Router();

router
  .route('/users')
  .post(UserService.createUsers)

router
  .route('/users/:userId')
  .get(UserService.getUserById)
  .patch(UserService.updateUsers)

router
  .route('/login')
  .post(UserService.login)

export default router;