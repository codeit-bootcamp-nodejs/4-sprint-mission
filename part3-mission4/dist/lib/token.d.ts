declare function generateTokens(userId: number): {
    accessToken: string;
    refreshToken: string;
};
declare function verifyAccessToken(token: string): {
    userId: any;
};
declare function verifyRefreshToken(token: string): {
    userId: any;
};
export { generateTokens, verifyAccessToken, verifyRefreshToken };
//# sourceMappingURL=token.d.ts.map