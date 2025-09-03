import express from 'express';
import { userController } from '../controllers/user-controller.js';
import { validation } from '../middlewares/validation.js';

const router = express.Router();

router.post('/register', userController.register);

import express from 'express';
