import express from 'express';
import articleService from '../services/articleService.js';
import commentService from '../services/commentService.js';
import passport from '../lib/passport/passport.js';
import { 
  checkArticleOwner,
  checkArticleCommentOwner
 } from '../middlewares/auth.js';


const articleRouter = express.Router();

 const createArticle = async(req, res, next) => {
  try{
    const authorId = req.user.id;
    const data = req.body;
    const newArticle = await articleService.register(authorId, data);
    res.status(201).json(newArticle);
  } catch(error){
    next(error);
  }
 }
  
const patchArticle = async(req, res, next) => {
  try{
    const articleId = +req.params.articleId;
    const data = req.body;
    const updatedArticle = await articleService.update(articleId, data);
    res.status(200).json(updatedArticle);
  } catch(error){;
    next(error);
  }
}

const deleteArticle = async(req, res, next) => {
  try{
    const articleId = +req.params.articleId;
    await articleService.remove(articleId);
    res.status(204).send();
  } catch(error){
    next (error);
  }
}

const createArticleComment = async(req, res, next) => {

  try{
    const content = req.body.content;
    const articleId = +req.params.articleId;
    const authorId = req.user.id;
    const newArticleComment = await commentService.registerArticleComment(authorId, articleId, content);
    res.status(201).json(newArticleComment);
  } catch(error){
    next(error);
  }
}

const patchComment = async(req, res, next) => {
  try{
    const content = req.body.content;
    const commentId = +req.params.commentId;
    const updatedComment = await commentService.updateComment(commentId, content);
    res.status(200).json(updatedComment);
  } catch(error){
    next(error);
  }
}

const deleteComment = async(req, res, next) => {
  try{
    const commentId = +req.params.commentId;
    await commentService.deleteComment(commentId);
    res.status(204).send();
  } catch(error){
    next(error);
  }
};

const controlLike = async(req, res, next) => {
  try {
    const userId = req.user.id;
    const { articleId } = req.body;
    const isLiked = await articleService.like(userId, articleId);
    if (isLiked) {
      res.status(201).json({ message: 'Like added successfully.', isLiked: true });
    } else {
      res.status(200).json({ message: 'Like removed successfully.', isLiked: false });
    }
  } catch(error){
    next(error);
  }
}

//path: http://localhost:3000/aritcles
//좋아요를 눌렀는지 안 눌렀는지... 그러면 이건 쿼리로 sort=


articleRouter.route('/')
 .post(passport.authenticate('access-token', { session: false}), createArticle)

articleRouter.route('/:articleId')
 .patch(passport.authenticate('access-token', { session: false }),checkArticleOwner,patchArticle)
 .delete(passport.authenticate('access-token', { session: false }), checkArticleOwner, deleteArticle);

articleRouter.route('/:articleId/comments')
   .post(passport.authenticate('access-token', { session: false }), createArticleComment)
 
articleRouter.route('/:articleId/comments/:commentId')
   .patch(passport.authenticate('access-token', { session: false }), checkArticleCommentOwner, patchComment)
   .delete(passport.authenticate('access-token', { session: false }), checkArticleCommentOwner, deleteComment)

articleRouter.post('/:articleId/likes',passport.authenticate('access-token', { session: false}), controlLike)
export default articleRouter

