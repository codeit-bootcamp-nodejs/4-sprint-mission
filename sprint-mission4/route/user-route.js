import express from 'express';
import UserService from '../service/user-service.js';
import zod from '../zod.js';


const router = express.Router();

router
  .route('/users')
  .post(UserService.createUsers);