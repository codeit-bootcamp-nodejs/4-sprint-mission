import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository';
import jwt from 'jsonwebtoken';

async function hashingPassword(password: string) {
    return bcrypt.hash(password, 10);
}

async function createUser(user: { email: string; nickname: string; password: string }) {
    const existedUser = await userRepository.findByEmail(user.email);


    if (existedUser) {
        const error = new Error('User already exists');
        throw error;
    }

    const hashedPassword = await hashingPassword(user.password); //// -password는 해싱해 저장합니다.
    const createdUser = await userRepository.save({
        ...user,
        password: hashedPassword,
    });
    return filterSensitiveUserData(createdUser);
}

function filterSensitiveUserData(user: { email: string; nickname: string; password: string }) {
    const { password, ...rest } = user;
    return rest;
}
//-------------------------------------------------------------------------
async function getUser(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        const error = new Error('Unauthorized');
        throw error;
    }
    await verifyPassword(password, user.password);
    return filterSensitiveUserData(user);
}

async function verifyPassword(inputPassword: string, savedpassword: string) {
    //isValid: 유효하다
    const isValid = await bcrypt.compare(inputPassword, savedpassword);
    if (!isValid) {
        const error = new Error('Unauthorized');
        throw error;
    }
}
////////////////////////////////////////////////////////////
function createToken(user: { id: number; email: string; nickname: string }) {
    const payload = { userId: user.id };
    const options = { expiresIn: '1h' };
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' as const } );
}

/////////////////////////////////////////////////////////////////
async function getUserById(id: number) {
    const user = await userRepository.findById(id);

    if (!user) {
        const error = new Error('Not Found');
        throw error;
    }

    return filterSensitiveUserData(user);
}



export default {
    createUser,
    getUser,
    verifyPassword,
    createToken,
    getUserById,
};
