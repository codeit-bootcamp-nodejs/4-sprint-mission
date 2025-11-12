import type { Request, Response, NextFunction } from 'express';
declare function authenticate(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export default authenticate;
//# sourceMappingURL=authenticate.d.ts.map