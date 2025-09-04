import bcrypt from 'bcrypt'
import prisma from 'lib/prisma.js'


class UserController{
    register = async(req,res,next) => {
        const {email, nickname, password} = req.body;

        const plainPassword = password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword,hash);

        const newUser = prisma.user.create({
            data:{
                password: hashedPassword,
                email,
                nickname
            }
        })
    }

    login = async(req,res,next) => {
        const {email, password} = req.body;
        const user = prisma.user.findUnique({}) 
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch){

        }
        return 
    }

    getUser = async(req,res,next) => {
        const userId = req.params.userId;
        const user = prisma.user.findUnique({
            where:{id:userId}
        })

        if (!user){

        }

        return user
    }

    patchUser = async(req,res,next) => {
        const {nickname, image} = req.body;
        const patchUser = prisma.user.update({
            data:{nickname,image}
        })
        return patchUser
    }

    patchPassword = async(req,res,next) => {
        const {password} = req.body;
        const patchUser = prisma.user.update({
            data:{password}
        })
        return patchUser
    }

    getUserProduct = async(req,res, next) => {
        const userId = req.params.userId;
        const user = prisma.user.findUnique({
            where:{id: userId},
            include:{product:true}
        })
        const userProduct = user.product

        return userProduct
    }
}

export default new UserController();