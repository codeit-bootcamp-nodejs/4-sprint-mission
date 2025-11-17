import ProductLike from "./post.product.like.js";
import getLikeProducts from "./get.like.products.js";
declare const productAPI: {
    createProduct: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
    createProductComment: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    getProductComments: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    getProductDetail: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    getProductList: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    updateProduct: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    updateProductComment: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    deleteProduct: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    deleteProductComment: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    ProductLike: typeof ProductLike;
    getLikeProducts: typeof getLikeProducts;
};
export default productAPI;
//# sourceMappingURL=index.d.ts.map