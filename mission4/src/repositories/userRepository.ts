import prisma from '../lib/prisma';

async function findByEmail(email: string) {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
}



async function save(user: { email: string; nickname: string; password: string })  {
    return prisma.user.create({
        data: {
            email: user.email,
            nickname: user.nickname,
            password: user.password,
        },
    });
}

 
async function findById(id: number) {
return prisma.user.findUnique({
    where: {
        id,
    },
});
}



// async function findById


export default {
    findByEmail,
    save,
    findById,
};
