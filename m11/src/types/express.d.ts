
import 'multer';
import type { AuthenticatedUser } from './common.js';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends AuthenticatedUser {}

    interface Request {
      resourceType?: string;
      resourceId?: string | null;
      file?: Multer.File;
    }

    namespace Multer {
      interface File {
        location?: string; // S3 URL
        key?: string; // S3 key
      }
    }
  }
}

// 이 파일이 모듈로 인식되도록 빈 export를 추가합니다.
export {};
