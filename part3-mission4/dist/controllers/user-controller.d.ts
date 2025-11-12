import type { Request, Response } from 'express';
declare class UserController {
    register(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): void;
    getUserProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateUserProfile(req: Request, res: Response): Promise<void>;
    updatePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUserComments(req: Request, res: Response): Promise<void>;
    getUserLikedProducts(req: Request, res: Response): Promise<void>;
    getUserLikedArticles(req: Request, res: Response): Promise<void>;
    getUserLikedComments(req: Request, res: Response): Promise<void>;
}
export declare const userController: UserController;
export {};
//# sourceMappingURL=user-controller.d.ts.map