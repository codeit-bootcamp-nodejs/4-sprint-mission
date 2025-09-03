import express from 'express';

// 라우터 함수는 컨트롤러와 미들웨어 인스턴스를 인자로 받습니다.
const articleRouter = (articleController, validationMiddleware) => {
  const router = express.Router();

  router
    .route('/')
    .post(articleController.createArticle)
    .get(articleController.getArticles);

  router
    .route('/:id')
    .get(validationMiddleware.validateId, articleController.getArticleById)
    .patch(validationMiddleware.validateId, articleController.updateArticle)
    .delete(validationMiddleware.validateId, articleController.deleteArticle);

  return router;
};

export default articleRouter;
