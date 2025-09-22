import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
export declare const createSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
}, z.core.$strict>;
export declare const updateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare function create(req: Request, res: Response, next: NextFunction): void;
export declare function update(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=article.d.ts.map