import express from 'express'

import LikeController from '../controller/like-controller.js';

import articleController from '../controller/article-controller.js';
import articleMiddleware from '../middleware/article-middleware.js';

import { checkAuthenticated, checkArticleAuthorize,  checkArticleCommentAuth} from '../middleware/auth-middleware.js';

import passport from 'passport';


const ArticleRouter = express.Router();

//article API routing
ArticleRouter.get('/', articleController.getArticles)

ArticleRouter.get('/detail/:id', 
    passport.authenticate('AccessToken', {session:false}),
    articleMiddleware.ValidateId,
    articleController.getOneArticle)

ArticleRouter.post('/', 
    articleMiddleware.ArticleValid, 
    articleMiddleware.ValidateForm,
    passport.authenticate('AccessToken', {session:false}) ,
    checkAuthenticated,
    articleController.postArticle)

ArticleRouter.patch('detail/:id', 
    articleMiddleware.ValidateId, 
    articleMiddleware.ValidateForm,
    checkArticleAuthorize,
    articleController.patchArticle)

ArticleRouter.delete('/detail/:id', 
    articleMiddleware.ValidateId,
    checkArticleAuthorize,
    articleController.deleteArticle )


//like feature
ArticleRouter.post('detail/:id',
    passport.authenticate('AccessToken', {session:false}) ,
    LikeController.ArticleLike
)

ArticleRouter.delete('detail/:id',
    passport.authenticate('AccessToken', {session:false}) ,
    LikeController.ArticleDislike
)


//article comments API routing
ArticleRouter.get('/comments', 
    articleController.getComments)

ArticleRouter.post('/detail/:id/comments', 
    articleMiddleware.ValidateId,
    passport.authenticate('AccessToken', {session:false}) ,
    articleController.postComment)

ArticleRouter.patch('/detail/:id/comments', 
    articleMiddleware.ValidateId,
    passport.authenticate('AccessToken', {session:false}) ,
    checkArticleCommentAuth,
    articleController.patchComment)
    
ArticleRouter.delete('/detail/:id/comments/:commentId', 
    articleMiddleware.ValidateId,
    passport.authenticate('AccessToken', {session:false}) ,
    checkArticleCommentAuth,
    articleController.deleteComment)

export default ArticleRouter;

