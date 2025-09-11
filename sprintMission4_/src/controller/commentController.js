/**
 * checkCommentOwner 아직 못 만듦
 * Comment 라우터만 제작함 그 다음은 그냥 복붙임 / service 남았다..!
 * 이거 products/:productId/comments --> 경로 수정해야 할 듯
 */

import express from 'express';
import commentService from '../services/commentService.js';
import passport from '../lib/passport/passport.js';
import { checkArticleCommentOwner, checkProductCommentOwner } from '../middlewares/auth.js'

const commentRouter = express.Router();

const createProductComment = async(req, res, next) => {
  const content = req.body.content;
  const productId = +req.params;
  try{
    const newProductComment = await commentService.registerProductomment(productId, content);
    res.status(201).json(newProductComment);
  } catch(error){
    next(error);
  }
}

const createArticleComment = async(req, res, next) => {
  const content = req.body.content;
  const articleId = +req.params;
  try{
    const newArticleComment = await commentService.registerArticleComment(articleId, content);
    res.status(201).json(newArticleComment);
  } catch(error){
    next(error);
  }
}

// 상품 게시글 수정하기 : /products/prodcst
const patchComment = async (req, res, next) => {
  try{
    const content = req.body.content;
    const commentId = +req.params.commentId;
    const updatedComment = await commentService.updateComment(commentId, content);
    res.status(201).json(updatedComment);
  } catch(error){
    next(error);
  }
}

const deleteComment = async (req, res, next) => {
  try{
    const commentId = +req.params.commentId;
    await commentService.deleteComment(commentId);
    res.status(204).send();
  } catch(error){
    next(error);
  }
};


commentRouter.route('/products/:productId/comments')
  .post(passport.authenticate('access-token', { session: false }), createProductComment)

commentRouter.route('/produxts/:productId/comments/:commentId')
  .patch(passport.authenticate('access-token', { session: false }), checkProductCommentOwner, patchComment)
  .delete(passport.authenticate('access-token', { session: false }), checkProductCommentOwner, deleteComment)

commentRouter.route('/aritcles/:articleId/comments')
  .post(passport.authenticate('access-token', { session: false }), createArticleComment)

commentRouter.route('/artices/:articlesId/comments/:commentId')
  .patch(passport.authenticate('access-token', { session: false }), checkArticleCommentOwner, patchComment)
  .delete(passport.authenticate('access-token', { session: false }), checkArticleCommentOwner, deleteComment)


export default commentRouter
  
