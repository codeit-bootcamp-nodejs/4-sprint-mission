import express from 'express';
import userController from '../controller/user-controller';
import passport from 'passport';


userRouter = express.router();

// register, login, get user information
userRouter.post('/login', userController.login)
userRouter.post('/register', userController.register)
userRouter.get('/:id', userController.getUser)

//modify user information
userRouter.patch('/:id', userController.patchUser)
userRouter.patch('/:id', userController.patchPassword)

//get products of login user
userRouter.get(':id/products', userController.getUserProduct)

//get liked products of login user
userRouter.get(':id/like', )



// passport.authenticate('local'),
// passport.authenticate('jwt')


export default userRouter;