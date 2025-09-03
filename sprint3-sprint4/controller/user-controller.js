import bcrypt from 'bcrypt'
import prisma from 'lib/prisma.js'
import 

class UserController{
    register = async(req,res,next) => {
        const {email, nickname, password} = req.body;

        const plainPassword = password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword,hash);

        const newUser =  prisma.user.create({
            data:{
                password: hashedPassword,
                email,
                nickname
            }
        })
    }

    login = (req,res,next) => {

    }


}