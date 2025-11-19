import { Router } from 'express';
import { upload } from '../../shared/middlewares/multer.middleware';
import { uploadImage } from './upload.controller';

const router = Router();

router.post('/', upload.single('image'), uploadImage);

export default router;
