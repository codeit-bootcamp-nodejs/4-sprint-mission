import prisma from "../lib/prisma.js";
import bcrypt from 'bcrypt';

async function getInfo(userId){
  try{
    const userInfo = await prisma.user.findUnique({ where: { id: userId }})
    const {password, ...withoutPassword} = userInfo;
    return withoutPassword;
  } catch(error){
    throw error;
  }
}

//    const updatedUser = await userService.updateUser(userId, data);
// 닉네임, 이메일은 고유값 
async function updateInfo(userId, data){
  try{
    const currentUser = await prisma.user.findUnique({ where: { id: userId }});

    if( data.email && data.email !== currentUser.email){
      const existedEmail = await prisma.user.findUnique({ where: { email: data.email }});
      if(existedEmail){
        const error = new Error('Confilct');
        error.status = 409;
        throw error;
      }
    }

    if( data.nickname && data.nickname !== currentUser.nickname){
      const existedNickname = await prisma.user.findUnique({ where: { nickname: data.nickname }});
      if(existedNickname){
        const error = new Error('Confilct');
        error.status = 409;
        throw error;
      }
    }
    const updatedInfo = await prisma.user.update({
      where: { id: userId },
      data
    })

    const {password, ...withoutPassword} = updatedInfo;
    return withoutPassword;
    
  } catch(error){
    throw error;
  }
}

//     const changedPassword = await userService.changePassword(userId, newPassword, oldPassword);
async function changePassword(userId, newPassword, oldPassword){
  try{
    const userInfo = await prisma.user.findUnique({ where: { id : userId },});
    const isValidPassword = await bcrypt.compare(oldPassword, userInfo.password);
    if (!isValidPassword){
      const error = new Error('Anauthorized');
      error.code = 401;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })
    return true;
  } catch(error){
    throw error;
  }
}

//const registeredProduct = await userService.getProdut(userId);

async function getProduct(userId){
  try{
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        Product: true,
      },
    });

    if(!user){
      const error = new Error('User not Found.');
      error.code = 404;
      throw error;
    }
    return user.Product; 
  } catch(error){
    throw error;
  } 
}

export default {
  getInfo,
  updateInfo,
  changePassword,
  getProduct,
}