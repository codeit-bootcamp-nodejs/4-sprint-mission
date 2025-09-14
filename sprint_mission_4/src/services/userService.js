import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from "../repositories/userRepository.js";
import productRepository from '../repositories/productRepository.js';

// 패스워드 해싱
async function hashingPassword(password) {
    return bcrypt.hash(password, 10);
}

// 민감 정보 빼기 (password, refreshToken)
async function filterseneitiveUserData(user) {
    const { password, refreshToken, ...rest } = user;
    return rest;
}

// 회원가입
async function createUser(user) {
    const existedUser = await userRepository.findByEmail(user.email);
    if (existedUser) {
        const error = new Error('user already exists');
        error.code = 409;
        throw error;
    };
    const hashedPaaword = await hashingPassword(user.password);
    const createdUser = await userRepository.save({ ...user, password: hashedPaaword });
    return filterseneitiveUserData(createdUser);
}

//토큰 만들기 & 리프레시 토큰
async function createToken(user, type) {
    const payload = { userId: user.id };
    const options = { expiresIn: type === 'refresh' ? '1w' : '1h' };
    return jwt.sign(payload, process.env.JWT_SECRET, options)
}

//만든 토큰 데이터 베이스에 업데이트 하기
async function updateUser(id, data) {
    return await userRepository.update(id, data);
}

async function verifyPassword(inputPassword, outputPassword) {
    const isVaild = await bcrypt.compare(inputPassword, outputPassword); //입력된 비번이랑 저장된 비번 동일한 지 확인만 함
    if (!isVaild) {
        const error = new Error('Unauthorized');
        error.code = 401;
        throw error;
    }
}

async function getUser(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        const error = new Error('Unauthorized');
        error.code = 401;
        throw error;
    }
    await verifyPassword(password, user.password); //패스워드 오류시 여기서 에러 던지고 리턴까지 안 감
    return filterseneitiveUserData(user);
}

//유저 정보 조회
async function getUserId(id) {
    const user = await userRepository.findById(id);
    if (!user) {
        const error = new Error('Unauthorized');
        error.code = 401;
        throw error;
    }
    return filterseneitiveUserData(user);
}

//유저 패스워드 수정
async function updatePassword(id, password) {
    const user = await userRepository.findById(id);
    if (!user) {
        const error = new Error('User not found');
        error.code = 404;
        throw error;
    }
    const hashedPassword = await hashingPassword(password);
    await userRepository.updateUserPassword(id, hashedPassword);
    return filterseneitiveUserData(user);
}

//유저가 등록한 상품 조회
async function getUserProducts(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
        const error = new Error('User not found');
        error.code = 404;
        throw error;
    }
    return await productRepository.getUserProduct(userId);
}

export default {
    createUser,
    createToken,
    updateUser,
    getUser,
    getUserId,
    updatePassword,
    getUserProducts,
}