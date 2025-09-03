import express from 'express';

userRouter = express.router();

userRouter.get('/:userId')
userRouter.get(':userID/products')
userRouter.patch('/:userId')


export default userRouter;