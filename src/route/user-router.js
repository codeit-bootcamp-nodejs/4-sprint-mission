import express from 'express';

const userRouter = (userController) => {
  const router = express.Router();

  router.post('/signup', userController.signUp);
  router.post('/signin', userController.signIn);

  return router;
};

export default userRouter;
