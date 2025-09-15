import express from 'express';
import userController from '../controller/user-controller.js';
import passport from 'passport';
import { checkUserAuth } from '../middleware/auth-middleware.js';
import { authUserWithParmaId } from '../lib/passport-lib.js';
import { REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants.js';

const userRouter = express.Router();

// register, login, get login user information
userRouter.post('/login', 
    userController.login)
userRouter.post('/register', 
    userController.register)
userRouter.get('/:id', 
    passport.authenticate('AccessToken', {session:false}) ,
    userController.getUser)

//modify user information
userRouter.patch('/:id', 
    passport.authenticate('AccessToken', {session:false}) ,
    userController.patchUser)
userRouter.patch('/:id',
     passport.authenticate('AccessToken', {session:false}) ,
     userController.patchPassword)

//get products of login user
userRouter.get('/:id/products',
     passport.authenticate("Access Token", {session:false}),
    checkUserAuth, 
     userController.getUserProduct)

//get liked products of login user
userRouter.get(':id/like', 
    passport.authenticate('AccessToken', {session:false}) ,

)

//refresh token
userRouter.post('auth/refresh',
    passport.authenticate('RefreshToken', {session:false})
)


// passport.authenticate('local'),
// passport.authenticate('jwt')


export default userRouter;