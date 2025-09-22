import prisma from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import createError from "http-errors";
export default async function updateUserChangePassword(req, res, next) {
    try {
        const password = req.body.password;
        if (!req.user) {
            return next(createError(401, "Unauthorized"));
        }
        const data = await prisma.user.findUnique({
            where: {
                id: req.user.id,
            },
            select: {
                password,
            },
        });
        if (!data) {
            return next(createError(404, "유저를 찾을 수 없습니다."));
        }
        const isPasswordValid = await bcrypt.compare(password, data.password);
        if (!isPasswordValid) {
            return next(createError(400, "암호가 올바르지 않음"));
        }
        await prisma.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                password: password,
            },
        });
        res.status(200).json({ message: "변경 성공함" });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=update.user.change.password.js.map