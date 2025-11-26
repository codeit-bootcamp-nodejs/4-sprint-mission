"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const prismaClient_1 = __importDefault(require("../src/lib/prismaClient"));
const constants_1 = require("../src/lib/constants");
describe('인증 API (로그인/회원가입)', () => {
    // 테스트에 사용할 고유한 사용자 정보
    const testUser = {
        email: `test-${Date.now()}@example.com`,
        nickname: `test-user-${Date.now()}`,
        password: 'password123',
    };
    let createdUserId;
    // 모든 테스트가 끝난 후 생성된 테스트 사용자 데이터를 삭제
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        if (createdUserId) {
            yield prismaClient_1.default.user.delete({ where: { id: createdUserId } });
        }
    }));
    describe('회원가입 (POST /auth/register)', () => {
        it('성공: 새로운 사용자를 생성하고 201 상태 코드를 반환해야 합니다.', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/register')
                .send(testUser);
            // 응답 검증
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe(testUser.email);
            expect(response.body.nickname).toBe(testUser.nickname);
            // 생성된 사용자 ID를 저장하여 afterAll에서 삭제할 수 있도록 함
            createdUserId = response.body.id;
        }));
        it('실패: 이미 존재하는 이메일로 가입 시 400 에러를 반환해야 합니다.', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/register')
                .send(Object.assign(Object.assign({}, testUser), { nickname: 'another-nickname' }));
            // 에러 응답 검증
            expect(response.status).toBe(400);
        }));
    });
    describe('로그인 (POST /auth/login)', () => {
        it('성공: 올바른 이메일과 비밀번호로 로그인 시 200 상태 코드와 토큰 쿠키를 반환해야 합니다.', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({
                email: testUser.email,
                password: testUser.password,
            });
            // 성공 응답 검증
            expect(response.status).toBe(200);
            // 쿠키에 토큰이 포함되어 있는지 검증
            const cookies = response.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies.some(cookie => cookie.startsWith(`${constants_1.ACCESS_TOKEN_COOKIE_NAME}=`))).toBe(true);
            expect(cookies.some(cookie => cookie.startsWith(`${constants_1.REFRESH_TOKEN_COOKIE_NAME}=`))).toBe(true);
        }));
        it('실패: 잘못된 비밀번호로 로그인 시 400 에러를 반환해야 합니다.', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({
                email: testUser.email,
                password: 'wrong-password',
            });
            // 에러 응답 검증
            expect(response.status).toBe(400);
        }));
        it('실패: 존재하지 않는 이메일로 로그인 시 400 에러를 반환해야 합니다.', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({
                email: 'non-existent-email@example.com',
                password: 'any-password',
            });
            // 에러 응답 검증
            expect(response.status).toBe(400);
        }));
    });
});
