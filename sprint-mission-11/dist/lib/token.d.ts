import type { Response } from "express";
export interface AuthedUser {
    id: number;
}
export declare function setJwtTokens(payloadId: string, res: Response): {
    accessToken: string;
    refreshToken: string;
};
export declare function clearJwtTokenCookies(res: Response): void;
//# sourceMappingURL=token.d.ts.map