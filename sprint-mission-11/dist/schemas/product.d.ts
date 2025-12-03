import { z } from "zod";
import type { NextFunction, Request, Response } from "express";
export declare const updateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare function create(req: Request, res: Response, next: NextFunction): void;
export declare function update(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=product.d.ts.map