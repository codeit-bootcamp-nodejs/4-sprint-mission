import jwt from 'jsonwebtoken';
import REFRESH_SECRET_KEY  from './constants'
import ACCESS_SECRET_KEY from  './constants'

class jsonWebToken{
    /*
    payload = { 
      userId: Int
    }
    */
    generateAccess = (payload) => {
        const SecretKey = ACCESS_SECRET_KEY;
        const accesToken = jwt.sign(payload, secretKey,
           {expiresIn: '1h'} )

        return accesToken
    }

    generateRefresh = (payload) => {
        const SecretKey = REFRESH_SECRET_KEY;
        const refreshToken = jwt.sign(payload, secretKey,
            {expiresIn: '1d'})

        return refreshToken
    }

    verify = (token, secretKey) => {
        const decoded = jwt.verify(token,secretKey)
        
        return decoded
    }
}