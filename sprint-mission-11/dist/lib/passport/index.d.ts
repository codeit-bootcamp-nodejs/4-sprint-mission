import passport from "passport";
declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id: number;
        };
    }
}
declare const passports: {
    passport: passport.PassportStatic;
    local: any;
    jwtAccess: any;
    jwtRefresh: any;
};
export default passports;
//# sourceMappingURL=index.d.ts.map