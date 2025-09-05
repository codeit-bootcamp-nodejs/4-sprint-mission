
import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js'
import jsonWebToken from '../lib/json-web-token.js';

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

    /*
     input: 현재 로그인한 유저의 
            product, user의 좋아요 관계인
            like 모델들의 모임
     output: 유저가 좋아요 한 product들을 list 형식으로 가져옵니다. 
     */
    likedProduct = async (likeModels) => {
        let likedProducList = [];
        for (const likedModel of likeModels){
            const productId= likedModel.productId;
            const Product = await prisma.product.findFirst({
                id:productId
            })
            likedProducList.push(product)
        }

        return likedProducList;
    }
    
    formatUser = async(user) => {
        let formattedUser = {};
        formattedUser.email = user.email;
        formattedUser.nickname = user.nickname;
        formattedUser.image = user.image;
        formattedUser.createdAt = user.createdAt;
        formattedUser.updatedAt = user.updatedAt;

        return formattedUser
    }
        

}

export default new userService();