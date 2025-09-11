import express from 'express';
import articleService from '../services/articleService.js';
import passport from '../lib/passport/passport.js';
import { checkArticleOwner } from '../middlewares/auth.js';

const articleRouter = express.Router();

 const createArticle = async(req, res) => {
  const {  title, content } = req.body;
  const data = { title, content};
  const authorId = req.user.id;
  try{
    const newArticle = await articleService.register(authorId, data);
    res.stauts(201).json(newArticle);
  }catch(error){
    if (error.code) {
      console.error(error);
      res.status(error.code).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
  
const patchArticle = async (req, res) => {
  const { data } = req.body;
  const articleId = +req.params.articleId;
  try{
    const updatedArticle = await articleService.update(articleId, data);
    res.status(201).json(updatedArticle);
  } catch(error){
    throw error;
  }
}

const deleteArticle = async (req, res) => {
  const { articleId } = +req.params.articleId;
  try{
    await articleService.remove(articleId);
    res.status(204).send();
  } catch(error){
    throw error;
  }
}


articleRouter.route('/articles')
 .post(passport.authenticate('access-token', { session: false}), createArticle)

 articleRouter.route('/:articleId')
 .patch(passport.authenticate('access-token', { session: false }),checkArticleOwner,patchArticle)
 .delete(passport.authenticate('access-token', { session: false }), checkArticleOwner, deleteArticle);

export default articleRouter

