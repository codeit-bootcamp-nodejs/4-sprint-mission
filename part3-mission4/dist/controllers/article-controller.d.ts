import type { Request, Response } from 'express';
declare class ArticleController {
    getAllArticles(req: Request, res: Response): Promise<void>;
    getArticleById(req: Request, res: Response): Promise<void>;
    createArticle(req: Request, res: Response): Promise<void>;
    updateArticle(req: Request, res: Response): Promise<void>;
    deleteArticle(req: Request, res: Response): Promise<void>;
    likeArticle(req: Request, res: Response): Promise<void>;
    unlikeArticle(req: Request, res: Response): Promise<void>;
    getUserArticles(req: Request, res: Response): Promise<void>;
}
export declare const articleController: ArticleController;
export {};
//# sourceMappingURL=article-controller.d.ts.map