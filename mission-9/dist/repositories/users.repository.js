import { prisma } from '../utils/prisma.util.js';
export class UsersRepository {
    constructor() {
        this.findUserByEmailOrNickname = async (email, nickname) => {
            const user = await prisma.user.findFirst({
                where: {
                    OR: [{ email }, { nickname }],
                },
            });
            return user;
        };
        this.findUserByEmail = async (email) => {
            const user = await prisma.user.findFirst({ where: { email } });
            return user;
        };
        this.findUserById = async (userId) => {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            return user;
        };
        this.createUser = async (userData) => {
            const user = await prisma.user.create({
                data: userData,
            });
            return user;
        };
        this.createRefreshToken = async (userId, token) => {
            const createdToken = await prisma.refreshToken.create({
                data: {
                    userId,
                    token,
                },
            });
            return createdToken;
        };
        this.findOtherUserByNickname = async (nickname, userId) => {
            const user = await prisma.user.findFirst({
                where: {
                    nickname,
                    id: { not: userId },
                },
            });
            return user;
        };
        this.updateUser = async (userId, dataToUpdate) => {
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: dataToUpdate,
                select: {
                    id: true,
                    email: true,
                    nickname: true,
                    image: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return updatedUser;
        };
        this.updateUserPassword = async (userId, hashedPassword) => {
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword },
            });
            return updatedUser;
        };
        this.deleteRefreshTokensByUserId = async (userId) => {
            await prisma.refreshToken.deleteMany({
                where: { userId },
            });
        };
        this.findRefreshToken = async (token) => {
            const storedToken = await prisma.refreshToken.findUnique({
                where: { token },
                include: { user: true },
            });
            return storedToken;
        };
    }
}
