// src/routes/upload.routes.js
import express from 'express';
import multer from '../middlewares/multer.js';
import { uploadImage } from '../controllers/upload.controller.js';

const router = express.Router();

router.post('/', multer.single('image'), uploadImage);

export default router;
