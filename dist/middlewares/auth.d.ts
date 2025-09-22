import type { Request, Response, NextFunction } from 'express';
interface AuthOptions {
    optional?: boolean;
}
declare function authenticate(options?: AuthOptions): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default authenticate;
//# sourceMappingURL=auth.d.ts.map