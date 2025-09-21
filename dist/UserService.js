"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    constructor(userRepository) {
        // 회원가입 로직
        this.signUp = async (userData) => {
            const { email, nickname, password } = userData;
            // 이메일 중복 확인
            const existingUser = await this.userRepository.findUserByEmail(email);
            if (existingUser) {
                throw new Error('이미 사용중인 이메일입니다.');
            }
            // 비밀번호 해싱
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            // 유저 생성
            const user = await this.userRepository.createUser({
                email,
                nickname,
                password: hashedPassword,
            });
            // 사용자 정보 반환
            const { password: _, refreshToken: __, ...userWithoutPassword } = user;
            return userWithoutPassword;
        };
        this.signIn = async (email, password) => {
            // 이메일로 사용자 조회
            const user = await this.userRepository.findUserByEmail(email);
            if (!user) {
                throw new Error('존재하지 않는 이메일입니다.');
            }
            // 비밀번호 확인
            const isPasswordMatched = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordMatched) {
                throw new Error('비밀번호가 일치하지 않습니다.');
            }
            // Access Token 생성 (12시간)
            const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '12h' });
            // Refresh Token 생성 (7일)
            const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' });
            // Refresh Token을 해싱해서 DB에 저장
            await this.userRepository.updateUser(user.id, {
                refreshToken: await bcrypt_1.default.hash(refreshToken, 10),
            });
            return { accessToken, refreshToken };
        };
        this.getUserById = async (id) => {
            return this.userRepository.findUserById(id);
        };
        this.updateUser = async (id, data) => {
            return this.userRepository.updateUser(id, data);
        };
        this.updatePassword = async (id, newPasswordHash) => {
            return this.userRepository.updateUser(id, { password: newPasswordHash });
        };
        this.getProductsByUserId = async (userId) => {
            return this.userRepository.findProductsByUserId(userId);
        };
        this.userRepository = userRepository;
    }
}
exports.default = UserService;
