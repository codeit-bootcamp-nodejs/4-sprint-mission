import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository.js';
import jwt from 'jsonwebtoken';

async function hashingPassword(password) {
    return bcrypt.hash(password, 10);
}

async function createUser(user) {
    const existedUser = await userRepository.findByEmail(user.email);

    if (existedUser) {
        const error = new Error('User already exists');
        error.code = 422;
        error.data = { email: user.email };
        throw error;
    }

    const hashedPassword = await hashingPassword(user.password); //// -password는 해싱해 저장합니다.
    const createdUser = await userRepository.save({...user, password: hashedPassword });
    return filterSensitiveUserData(createdUser);
}

function filterSensitiveUserData(user) {
    const { password, ...rest } = user;
    return rest;
}
 //-------------------------------------------------------------------------
 async function getUser(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        const error = new Error('Unauthorized');
        error.code = 401;
        throw error;
    }
    await verifyPassword(password, user.password);
    return filterSensitiveUserData(user);
 }

async function verifyPassword(inputPassword, savedpassword) { //isValid: 유효하다
    const isValid = await bcrypt.compare(inputPassword, savedpassword);
    if (!isValid) {
        const error = new Error ('Unauthorized');
        error.code = 401;
        throw error;
    }
 } 
////////////////////////////////////////////////////////////
async function createToken(user) {
  const payload = { userId: user.id };
  const options = { expiresIn: '1h' };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

/////////////////////////////////////////////////////////////////
async function getUserById(id) {
    const user = await userRepository.findById(id);

    if (!user) {
        const error = new Error('Not Found');
        error.code = 404;
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