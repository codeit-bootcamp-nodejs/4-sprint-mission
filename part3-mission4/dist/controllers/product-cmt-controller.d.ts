import type { Request, Response } from 'express';
declare class ProductCommentController {
    getComments(req: Request, res: Response): Promise<void>;
    createComment(req: Request, res: Response): Promise<void>;
    updateComment(req: Request, res: Response): Promise<void>;
    deleteComment(req: Request, res: Response): Promise<void>;
    likeComment(req: Request, res: Response): Promise<void>;
    unlikeComment(req: Request, res: Response): Promise<void>;
}
export declare const productCommentController: ProductCommentController;
export {};
//# sourceMappingURL=product-cmt-controller.d.ts.map