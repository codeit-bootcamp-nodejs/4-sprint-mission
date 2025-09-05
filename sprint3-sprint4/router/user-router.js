import express from 'express';
import userController from '../controller/user-controller';
import passport from 'passport';
import checkAuthenticated from '../middleware/auth-middleware.js';

userRouter = express.router();

// register, login, get login user information
userRouter.post('/login', userController.login)
userRouter.post('/register', userController.register)
userRouter.get('/:id', passport.authenticate('AccessToken', {session:false}) ,
    userController.getUser)

//modify user information
userRouter.patch('/:id', passport.authenticate('AccessToken', {session:false}) ,
    userController.patchUser)
userRouter.patch('/:id', passport.authenticate('AccessToken', {session:false}) ,
     userController.patchPassword)

//get products of login user
userRouter.get(':id/products', passport.authenticate('AccessToken', {session:false}) ,
     userController.getUserProduct)

//get liked products of login user
userRouter.get(':id/like', passport.authenticate('AccessToken', {session:false}) ,

)



// passport.authenticate('local'),
// passport.authenticate('jwt')


export default userRouter;