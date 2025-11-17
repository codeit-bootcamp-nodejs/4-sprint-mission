import { type IComment, type IOwner, type IProductTag } from "./product.service.js";
import type { Request, Response } from "express";
export interface RequestQuery {
    pagenataion: {
        page: number;
        take: number;
    };
}
export interface RequestBody {
    name: string | null;
    description: string | null;
    price: number;
    productTags: IProductTag[];
    comment?: IComment[];
    owner?: IOwner;
    ownerId: number;
}
export interface RequestParams {
    id: number;
}
export declare class ProductController {
    getProductListCont(req: Request<{}, {}, {}, RequestQuery>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getProductCont(req: Request<RequestParams, {}, {}, {}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createProductCont(req: Request<{}, {}, RequestBody, {}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    modifiedProductCont(req: Request<RequestParams, {}, RequestBody, {}>, res: Response): Promise<void>;
    poppedProductCont(req: Request<RequestParams, {}, {}, {}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=product.controller.d.ts.map