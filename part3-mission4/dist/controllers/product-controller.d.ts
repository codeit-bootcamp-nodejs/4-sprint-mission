import type { Request, Response } from 'express';
declare class ProductController {
    getAllProducts(req: Request, res: Response): Promise<void>;
    getProductById(req: Request, res: Response): Promise<void>;
    createProduct(req: Request, res: Response): Promise<void>;
    updateProduct(req: Request, res: Response): Promise<void>;
    deleteProduct(req: Request, res: Response): Promise<void>;
    likeProduct(req: Request, res: Response): Promise<void>;
    unlikeProduct(req: Request, res: Response): Promise<void>;
    getUserProducts(req: Request, res: Response): Promise<void>;
}
export declare const productController: ProductController;
export {};
//# sourceMappingURL=product-controller.d.ts.map