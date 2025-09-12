import jwt from 'jsonwebtoken';
import { REFRESH_SECRET_KEY, ACCESS_SECRET_KEY}  from './constants.js'

export class jsonWebToken{
    /*
    payload = { 
      userId: Int
    }
    */
    generateAccess = (user) => {
        const SecretKey = ACCESS_SECRET_KEY;
        const payload = {
            userId: user.id
        }
        const accesToken = jwt.sign(payload, SecretKey,
           {expiresIn: '10h'} )
        console.log("at json-web-token.js, acceessToken: ", accesToken)
        return accesToken
    }

    generateRefresh = (payload) => {
        const SecretKey = REFRESH_SECRET_KEY;
        const refreshToken = jwt.sign(payload.userId, secretKey,
            {expiresIn: '1d'})

        return refreshToken
    }

    verify = (token, secretKey) => {
        const decoded = jwt.verify(token,secretKey)
        
        return decoded
    }
}

export default new jsonWebToken();