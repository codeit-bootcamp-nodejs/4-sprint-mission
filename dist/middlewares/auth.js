import prisma from '../lib/prisma.js';
import { verifyAccessToken } from '../lib/token.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants.js';
function authenticate(options = { optional: false }) {
    return async (req, res, next) => {
        const accessToken = req.cookies?.[ACCESS_TOKEN_COOKIE_NAME];
        if (!accessToken) {
            if (options.optional) {
                return next();
            }
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        try {
            const { userId } = verifyAccessToken(accessToken);
            const user = await prisma.user.findUnique({ where: { id: userId } });
            req.user = user;
        }
        catch (error) {
            if (options.optional) {
                return next();
            }
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        next();
    };
}
export default authenticate;
//# sourceMappingURL=auth.js.map