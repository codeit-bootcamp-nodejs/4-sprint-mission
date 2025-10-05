export declare function generateTokens(userId: number | string): {
    accessToken: string;
    refreshToken: string;
};
export declare function verifyAccessToken(token: string): {
    userId: number | string;
};
export declare function verifyRefreshToken(token: string): {
    userId: number | string;
};
//# sourceMappingURL=token.d.ts.map