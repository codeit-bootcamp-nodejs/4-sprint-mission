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
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../src/lib/constants");
describe('게시글 API', () => {
    let articleId; //게시글 id를 저장할 변수
    let testUser; //테스트 사용자
    let otherUser; //다른 사용자
    let userTokenCookie; // 로그인 상태를 유지하기 위한 인증 토큰
    let createdArticleIds = []; //생성된 게시글의 아이디 목록
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const salt = 10; //비밀번호 해싱용 솔트값
        const password = 'password123'; //공통비밀번호
        const usersData = [
            {
                email: `article-test-${Date.now()}@example.com`, //테스트용 이메일 주소를 매번 고유하게 생성
                nickname: `article-tester-${Date.now()}`, //닉네임 값도 매번 고유하게 생성
                password: yield bcrypt_1.default.hash(password, salt), //비밀번호를 단방향해싱
            },
            {
                email: `article-other-${Date.now()}@example.com`,
                nickname: `article-other-${Date.now()}`,
                password: yield bcrypt_1.default.hash(password, salt),
            },
        ];
        [testUser, otherUser] = yield Promise.all(//두명의 테스트정보를 디비에 저장 후 결과 동시에 반환 //프로미스 올: 동시에 실행하고 모두 끝날때까지 기다리기
        usersData.map(data => prismaClient_1.default.user.create({ data })) //배열에 들어 있는 여러 사용자 데이터를 한 번에 DB에 저장할 준비를 하는 코드
        ); //map은 배열의 각 요소를 변환하는 함수
        const loginResponse = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({
            email: testUser.email, //이 내용들을
            password: password,
        });
        const cookies = loginResponse.headers['set-cookie']; //TypeScript에게 “이건 문자열 배열이야”라고 알려주는 타입 단언
        const accessTokenCookie = cookies.find(cookie => cookie.startsWith(constants_1.ACCESS_TOKEN_COOKIE_NAME)); //cookie.startsWith(...) : 문자열이 특정 단어로 시작하는지 확인
        if (!accessTokenCookie) {
            throw new Error('Access token cookie not found');
        }
        userTokenCookie = accessTokenCookie;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        if (createdArticleIds.length > 0) { //아이디 배열 갯수가 0보다 크면
            yield prismaClient_1.default.article.deleteMany({ where: { id: { in: createdArticleIds } } });
        }
        yield prismaClient_1.default.user.deleteMany({ where: { id: { in: [testUser.id, otherUser.id] } } });
    }));
    describe('POST /articles (게시글 생성)', () => {
        it('성공: 인증된 사용자가 게시글을 생성합니다', () => __awaiter(void 0, void 0, void 0, function* () {
            const articleData = { title: 'New Article', content: 'This is a test article.', image: null };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/articles')
                .set('Cookie', userTokenCookie) //로그인한 상태
                .send(articleData);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id'); //toHaveProperty = “이 안에 그 아이디의 정보가 있나?
            expect(response.body.title).toBe(articleData.title);
            createdArticleIds.push(response.body.id);
            articleId = response.body.id;
        }));
        it('실패: 인증되지 않은 사용자는 401 에러를 반환해야 합니다', () => __awaiter(void 0, void 0, void 0, function* () {
            const articleData = { title: 'Unauthorized Article', content: 'This should not be created.', image: null };
            const response = yield (0, supertest_1.default)(app_1.default).post('/articles').send(articleData);
            expect(response.status).toBe(401);
        }));
    });
    describe('PATCH /articles/:id (게시글 수정)', () => {
        it('성공: 게시글 작성자가 내용을 수정합니다', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedData = { title: 'Updated Title', image: null };
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch(`/articles/${articleId}`)
                .set('Cookie', userTokenCookie)
                .send(updatedData);
            expect(response.status).toBe(200);
            expect(response.body.title).toBe(updatedData.title);
        }));
        it('실패: 작성자가 아닌 사용자는 403 에러를 반환해야 합니다', () => __awaiter(void 0, void 0, void 0, function* () {
            const otherUserLogin = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({
                email: otherUser.email,
                password: 'password123',
            });
            const otherUserCookie = otherUserLogin.headers['set-cookie'].find(c => c.startsWith(constants_1.ACCESS_TOKEN_COOKIE_NAME));
            const updatedData = { title: 'Forbidden Update', image: null };
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch(`/articles/${articleId}`)
                .set('Cookie', otherUserCookie)
                .send(updatedData);
            expect(response.status).toBe(403);
        }));
    });
    describe('DELETE /articles/:id (게시글 삭제)', () => {
        it('실패: 작성자가 아닌 사용자는 403 에러를 반환해야 합니다', () => __awaiter(void 0, void 0, void 0, function* () {
            const otherUserLogin = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({
                email: otherUser.email,
                password: 'password123',
            });
            const otherUserCookie = otherUserLogin.headers['set-cookie'].find(c => c.startsWith(constants_1.ACCESS_TOKEN_COOKIE_NAME));
            const response = yield (0, supertest_1.default)(app_1.default)
                .delete(`/articles/${articleId}`)
                .set('Cookie', otherUserCookie);
            expect(response.status).toBe(403);
        }));
        it('성공: 게시글 작성자가 게시글을 삭제합니다', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .delete(`/articles/${articleId}`)
                .set('Cookie', userTokenCookie);
            expect(response.status).toBe(204);
        }));
    });
    describe('GET /articles', () => {
        it('올바른 구조의 게시글 목록을 반환해야 합니다', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get('/articles');
            expect(response.status).toBe(200);
            expect(response.body.list).toBeInstanceOf(Array);
        }));
    });
    describe('GET /articles/:id', () => {
        it('삭제된 게시글 조회 시 404를 반환해야 합니다', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get(`/articles/${articleId}`);
            expect(response.status).toBe(404);
        }));
    });
});
