import jwt from 'jsonwebtoken';
import { REFRESH_SECRET_KEY, ACCESS_SECRET_KEY}  from './constants.js'
import type {User} from '../controller/user-controller.js'

interface payload{
    userId: number
}





export class jsonWebToken{
    /*
    payload = { 
      userId: Int
    }
    */
    generateAccess = (user:User) => {
        const SecretKey = ACCESS_SECRET_KEY;
        const payload = {
            userId: user.id
        }
        const accesToken = jwt.sign(payload, SecretKey,
           {expiresIn: '10h'} )
        console.log("at json-web-token.js, acceessToken: ", accesToken)
        return accesToken
    }

    generateRefresh = (payload:payload) => {
        const SecretKey = REFRESH_SECRET_KEY;
        const refreshToken = jwt.sign(payload.userId, SecretKey,
            {expiresIn: '1d'})

        return refreshToken
    }

    verify = (token:string, SecretKey:string) => {
        const decoded = jwt.verify(token,SecretKey)
        
        return decoded
    }
}

export default new jsonWebToken();