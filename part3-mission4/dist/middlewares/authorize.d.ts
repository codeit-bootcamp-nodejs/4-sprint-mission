import type { Request, RequestHandler } from 'express';
type Params = {
    id?: string;
    commentId?: string;
    userId?: string;
};
type ModelGetter = (req: Request<Params>) => Promise<{
    userId: number;
} | null>;
export declare const isOwner: (modelGetter: ModelGetter) => RequestHandler;
export declare const isProductOwner: RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const isArticleOwner: RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const isCommentOwner: RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const isUserSelf: RequestHandler;
export declare const verifyPassword: RequestHandler;
export {};
//# sourceMappingURL=authorize.d.ts.map