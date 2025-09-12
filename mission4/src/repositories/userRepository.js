import prisma from '../../lib/prisma.js';

 async function findByEmail(email) {
    return prisma.user.findUnique({
        where: {
            email
        }
    });
 } 

async function save(user) {
    return prisma.user.create({
        data: user,
    });
 } 


 export default {
    findByEmail, 
    save
 };