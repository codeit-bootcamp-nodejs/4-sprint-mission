import express from 'express';

const imageRouter = (imageController, imageMiddleware) => {
  const router = express.Router();

  router.post(
    '/',
    imageMiddleware.upload.single('image'),
    imageMiddleware.resize,
    imageController.uploadImage,
  );

  return router;
};

export default imageRouter;
