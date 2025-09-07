import express from 'express';
import passport from '../lib/passport/passport.js';
import articleService from '../services/productService.js';
import auth from '../middlewares/auth.js';

/**
 * model Article {
  id        Int       @id
  title     String
  content   String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  Comments  Comment[]
  user      User      @relation(fields: [userId], references: [id])
  userId    Int
}
 */

const articleRouter = express.Router();

articleRouter.post(
  '/auth/articles',
  passport.authenticate('access-token', { session: false }),
  async(req, res) => {
    try{
      const userId = req.user.id;
      const { title, content } = req.body;
      const newArticle = await articleService.registerArticle(userId, {
        title,
        content
      });
      res.status(201).json(newArticle);
    } catch(error){
      console.error('Error Registsering Article:', error);
      res.status(error.code || 500).json({ message: error.message});
    }
  }
);

productRouter.patch(
  '/auth/articles/:articleId',
  passport.authenticate('access-token', { session: false }),
  auth.checkArticleOwner,
  async (req, res) => {
    try{
      const articleId = +req.params.articleId;
      const data  = req.body; 
      const updatedProduct = await productService.updateArticle(articleId, data);
      res.status(201).json(updatedArticle);
    } catch(error){
      console.error('Error Updating article:', error);
      res.status(error.code || 500).json({ message: error.message });
    }
  }
);