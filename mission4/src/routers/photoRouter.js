import express from 'express';
import multer from 'multer';
import passport from '../lib/passport/index.js';
import prisma from '../lib/prisma.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/'})

router.post(
    '/users/photos',
    passport.authenticate('access-token', { session: false }),
    upload.single('image'),
    async(req, res, next) => { 
  const user = req.user;

  if (!req.file) {
    return res.status(400).json({ message: 'No file upload' });
  }

  try{
    const imageUrl = `/download/${req.file.filename}`;
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { image: imageUrl },
    });

    res.status(200).json({
        message: 'Photo uploaded successfully',
        image: updatedUser.image,
    });
  } catch (err) {
    next(err);
  }
});

export default router;