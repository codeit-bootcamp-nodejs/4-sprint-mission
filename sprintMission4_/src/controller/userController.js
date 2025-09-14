import express from 'express'
import userService from '../services/userService.js'
import passport from '../lib/passport/passport.js';

const userRouter = express.Router();
//path: /users/:id

const getUser = async (req, res, next) => {
  try{
    const userId = req.user.id;
    const userInfo = await userService.getInfo(userId);
    res.status(200).json(userInfo);
  } catch(error){
    next(error);
  }
}

const updateUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = req.body;
    const updatedUser = await userService.updateInfo(userId, data);
    res.status(201).json(updatedUser);
  } catch(error){
    next(error);
  }
}

const changePassword = async (req, res, next) => {
  try{
    const userId = req.user.id;
    const { newPassword, oldPassword } = req.body;
    await userService.changePassword(userId, newPassword, oldPassword);
    res.status(200).json('Password has been successfully changed.');
  } catch(error){
    next(error);
  }
}

const getUserProduct = async (req, res, next) => {
  try{
    const userId = req.user.id;
    const registeredProduct = await userService.getProduct(userId);
    res.status(200).json(registeredProduct);
  } catch(error){
    next(error);
  }
}


userRouter.route('/')
  .get(passport.authenticate('access-token',{ session: false }), getUser)
  .patch(passport.authenticate('access-token',{ session: false }), updateUser)

userRouter.route('/password')
  .patch(passport.authenticate('access-token',{ session: false }), changePassword)

userRouter.route('/products')
  .get(passport.authenticate('access-token', { session: false }), getUserProduct);

export default userRouter