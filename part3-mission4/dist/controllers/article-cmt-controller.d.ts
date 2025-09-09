import type { Request, Response } from 'express';
declare class ArticleCommentController {
    getComments(req: Request, res: Response): Promise<void>;
    createComment(req: Request, res: Response): Promise<void>;
    updateComment(req: Request, res: Response): Promise<void>;
    deleteComment(req: Request, res: Response): Promise<void>;
    likeComment(req: Request, res: Response): Promise<void>;
    unlikeComment(req: Request, res: Response): Promise<void>;
}
export declare const articleCommentController: ArticleCommentController;
export {};
//# sourceMappingURL=article-cmt-controller.d.ts.map