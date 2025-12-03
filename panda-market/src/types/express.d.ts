import type { JwtPayload } from 'jsonwebtoken';
import 'multer';

declare global {
  namespace Express {
    namespace Multer {
      interface File {
        location: string;
        key: string;
        bucket: string;
        acl?: string;
        etag?: string;
      }
    }
    export interface Request {
      // middleware를 통과한 후에만 존재하므로 optional로 선언
      parentId?: number; // idSchema가 string을 반환한다고 가정
      parentType?: 'products' | 'articles';
      tokenPayload?: JwtPayload;
      parsedId?: {
        id: number;
      };
      parsedQuery?: {
        keyword: string;
        page: number;
        pageSize: number;
        orderBy: string;
      };
      parsedCursorQuery?: {
        cursorId?: number;
        page: number;
        pageSize: number;
      };
    }
  }
}
