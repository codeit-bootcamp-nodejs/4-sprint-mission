
import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js'

class userService{
    createUser = async({password,email,nickname}) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,hash);
        const data= {
                    password: hashedPassword,
                    email,
                    nickname}

        const newUser = await prisma.user.create({data})
        return newUser
    }
    
    loginAndGiveToken = async({email,password}) => {
        const user = await prisma.user.findUnique({
            where:{email}
        });

        if (user){
            let accessToken
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch){
                accessToken = jsonWebToken.generateAccess(user.id)
            }
            return accessToken
        }else{
            throw Error;
        }
    }

    


}

export default new userService();