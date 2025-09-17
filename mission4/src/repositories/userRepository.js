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
    data: {
      email: user.email,
      name: user.name,
      password: user.password,
    },
  });
}


 export default {
    findByEmail, 
    save
 };