import express from 'express';
import userController from '../controller/user-controller';
import passport from 'passport';

userRouter = express.router();


userRouter.post('/login', userController.login)
userRouter.post('/register', userController.register)

userRouter.get('/:userId', userController.getUser)
userRouter.patch('/:userId', userController.patchUser)
userRouter.patch('/:userId', userController.patchPassword)

userRouter.get(':userID/products', userController.getUserProduct)


// passport.authenticate('local'),
// passport.authenticate('jwt')


export default userRouter;