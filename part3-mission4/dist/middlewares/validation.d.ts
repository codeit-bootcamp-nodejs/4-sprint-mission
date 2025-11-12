import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
declare class Validation {
    productSchema: z.ZodObject<{
        name: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodString>;
        description: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodString>;
        price: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNumber>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    productUpdateSchema: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodNumber>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    articleSchema: z.ZodObject<{
        title: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodString>;
        content: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodString>;
    }, z.core.$strip>;
    articleUpdateSchema: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    commentSchema: z.ZodObject<{
        content: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodString>;
    }, z.core.$strip>;
    idSchema: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
    validateRegister(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    validate(schema: z.ZodTypeAny): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    validateParam(paramName: string, schema: z.ZodTypeAny): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
}
export declare const validation: Validation;
export {};
//# sourceMappingURL=validation.d.ts.map