declare const articleApi: {
    createArticleComment: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    createArticle: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    getArticleDetail: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    getArticleList: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    getArticleComment: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    updateArticle: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    updateArticleComment: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    deleteArticle: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    deleteArticleComment: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
};
export default articleApi;
//# sourceMappingURL=index.d.ts.map