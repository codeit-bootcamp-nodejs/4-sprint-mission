// src/types/multer-s3.d.ts
declare module 'multer-s3' {
    import { S3Client } from '@aws-sdk/client-s3';
    import { StorageEngine } from 'multer';

    interface Options {
        s3: S3Client;
        bucket: string | ((req: Express.Request, file: Express.Multer.File, callback: (error: any, bucket?: string) => void) => void);
        key?: (req: Express.Request, file: Express.Multer.File, callback: (error: any, key?: string) => void) => void;
        acl?: string;
        contentType?: any;
        metadata?: (req: Express.Request, file: Express.Multer.File, callback: (error: any, metadata?: any) => void) => void;
    }

    function multerS3(options: Options): StorageEngine;

    namespace multerS3 {
        const AUTO_CONTENT_TYPE: any;
    }

    export = multerS3;
}