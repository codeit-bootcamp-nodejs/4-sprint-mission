import express from 'express';

import { createSessionController } from './create/create-sessions.controller.js';
import { deleteSessionController } from './delete/delete-sessions.controller.js';

export const sessionRouter = express.Router();

sessionRouter
  .route('/')
  .post(createSessionController) // 로그인
  .delete(deleteSessionController); // 로그아웃 refresh 폐기
