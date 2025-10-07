export interface IProduct {
    id: number;
    name: string | null;
    description: string | null;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    productTags: IProductTag[];
    comments: IComment[];
    owner?: IOwner;
}
export interface IComment {
    id: number;
    title: string | null;
    type?: string | null;
    content: string | null;
    user?: IOwner;
    product?: IProduct;
}
export interface IOwner {
    id: number;
    nickname: string | null;
}
export interface IProductTag {
    tagId: number;
    productId: number;
}
export interface ITag {
    id: number;
    name: string;
}
export interface InputProuduct {
    input: IProduct[];
    pagenataion: {
        take?: number ;
        skip?: number | 1;
    };
}
export interface InputCreateProduct {
    name: string | null;
    description: string | null;
    price: number;
    productTags: IProductTag[];
    ownerId: number;
}
export interface OutputCreateProduct {
    name: string | null;
    description: string | null;
    price: number;
    productTags: IProductTag[];
    ownerId: number;
}
export interface InputUpdatedProduct {
    id: number;
    name?: string | null;
    description?: string | null;
    price?: number;
    productTags: IProductTag[];
}
export interface OutputUpdatedProduct extends InputUpdatedProduct {
}
export declare class ProuductService {
    getProductList(input: InputProuduct, keyword?: string): Promise<IProduct[]>;
    getProduct({ id }: {
        id: number;
    }): Promise<IProduct>;
    createdProduct({ input }: {
        input: InputCreateProduct;
    }): Promise<OutputCreateProduct>;
    modifiedProduct({ input }: {
        input: InputUpdatedProduct;
    }): Promise<OutputUpdatedProduct>;
    deletedProduct({ id }: {
        id: number;
    }): Promise<void>;
}
//# sourceMappingURL=product.service.d.ts.map