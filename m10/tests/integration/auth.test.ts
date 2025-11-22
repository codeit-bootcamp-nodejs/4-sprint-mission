import { testRequest, expectSuccess, expectError } from '../helpers/testUtils.js';
import { cleanDatabase, setupTestDatabase, closeDatabase, prisma } from '../setup/testDatabase.js';
import { createTestUser } from '../helpers/dataFactory.js';

describe('인증 API', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    });

    beforeEach(async () => {
        await cleanDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    describe('POST /auth/signup', () => {
        it('새로운 사용자를 성공적으로 회원가입해야 함', async () => {
            const userData = {
                email: 'newuser@example.com',
                nickname: 'NewUser',
                password: 'password123',
            };

            const response = await testRequest.post('/auth/signup').send(userData);

            expectSuccess(response, 201);
            expect(response.body.data).toMatchObject({
                email: userData.email,
                nickname: userData.nickname,
            });
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).not.toHaveProperty('password');
        });

        it('필수 필드가 누락되면 실패해야 함', async () => {
            const response = await testRequest.post('/auth/signup').send({
                email: 'test@example.com',
            });

            expectError(response, 400);
        });

        it('이메일이 누락되면 실패해야 함', async () => {
            const response = await testRequest.post('/auth/signup').send({
                nickname: 'TestUser',
                password: 'password123',
            });

            expectError(response, 400);
        });

        it('닉네임이 누락되면 실패해야 함', async () => {
            const response = await testRequest.post('/auth/signup').send({
                email: 'test@example.com',
                password: 'password123',
            });

            expectError(response, 400);
        });

        it('비밀번호가 누락되면 실패해야 함', async () => {
            const response = await testRequest.post('/auth/signup').send({
                email: 'test@example.com',
                nickname: 'TestUser',
            });

            expectError(response, 400);
        });

        it('이메일이 이미 존재하면 실패해야 함', async () => {
            const existingUser = await createTestUser({ email: 'existing@example.com' });

            const response = await testRequest.post('/auth/signup').send({
                email: existingUser.email,
                nickname: 'AnotherUser',
                password: 'password123',
            });

            expectError(response, 409);
        });

        it('비밀번호를 해싱하여 저장해야 함', async () => {
            const userData = {
                email: 'hashtest@example.com',
                nickname: 'HashTest',
                password: 'password123',
            };

            await testRequest.post('/auth/signup').send(userData);

            const user = await prisma.user.findUnique({
                where: { email: userData.email },
            });

            expect(user).toBeDefined();
            expect(user!.password).not.toBe(userData.password);
            expect(user!.password).toContain('$2');
        });
    });

    describe('POST /auth/login', () => {
        it('올바른 인증 정보로 성공적으로 로그인해야 함', async () => {
            await createTestUser({
                email: 'logintest@example.com',
                nickname: 'LoginTest',
            });

            const response = await testRequest.post('/auth/login').send({
                email: 'logintest@example.com',
                password: 'password123',
            });

            expectSuccess(response, 200);
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.headers['set-cookie']).toBeDefined();

            const setCookieHeader = response.headers['set-cookie'];
            const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
            const refreshTokenCookie = cookies.find((cookie) => cookie?.startsWith('refreshToken='));
            expect(refreshTokenCookie).toBeDefined();
            expect(refreshTokenCookie).toContain('HttpOnly');
            expect(refreshTokenCookie).toContain('Path=/auth');
        });

        it('이메일이 누락되면 실패해야 함', async () => {
            const response = await testRequest.post('/auth/login').send({
                password: 'password123',
            });

            expectError(response, 400);
        });

        it('비밀번호가 누락되면 실패해야 함', async () => {
            const response = await testRequest.post('/auth/login').send({
                email: 'test@example.com',
            });

            expectError(response, 400);
        });

        it('잘못된 비밀번호로 실패해야 함', async () => {
            await createTestUser({
                email: 'wrongpass@example.com',
            });

            const response = await testRequest.post('/auth/login').send({
                email: 'wrongpass@example.com',
                password: 'wrongpassword',
            });

            expectError(response, 401);
        });

        it('존재하지 않는 사용자로 실패해야 함', async () => {
            const response = await testRequest.post('/auth/login').send({
                email: 'nonexistent@example.com',
                password: 'password123',
            });

            expectError(response, 401);
        });

        it('리프레시 토큰을 데이터베이스에 저장해야 함', async () => {
            const user = await createTestUser({
                email: 'tokentest@example.com',
            });

            await testRequest.post('/auth/login').send({
                email: 'tokentest@example.com',
                password: 'password123',
            });

            const refreshToken = await prisma.refreshToken.findFirst({
                where: { userId: user.id },
            });

            expect(refreshToken).toBeDefined();
            expect(refreshToken!.token).toBeDefined();
        });
    });

    describe('POST /auth/refresh', () => {
        it('유효한 리프레시 토큰으로 액세스 토큰을 갱신해야 함', async () => {
            await createTestUser({
                email: 'refresh@example.com',
            });

            const loginResponse = await testRequest.post('/auth/login').send({
                email: 'refresh@example.com',
                password: 'password123',
            });

            expectSuccess(loginResponse, 200);

            const setCookieHeader = loginResponse.headers['set-cookie'];
            const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
            const refreshTokenCookie = cookies.find((cookie) => cookie?.startsWith('refreshToken='));

            expect(refreshTokenCookie).toBeDefined();

            const response = await testRequest.post('/auth/refresh').set('Cookie', refreshTokenCookie!);

            expectSuccess(response, 200);
            expect(response.body.data).toHaveProperty('accessToken');
        });

        it('리프레시 토큰이 누락되면 실패해야 함', async () => {
            const response = await testRequest.post('/auth/refresh');

            expectError(response, 401);
        });
    });

    describe('POST /auth/logout', () => {
        it('성공적으로 로그아웃하고 리프레시 토큰을 삭제해야 함', async () => {
            const user = await createTestUser({
                email: 'logout@example.com',
            });

            const loginResponse = await testRequest.post('/auth/login').send({
                email: 'logout@example.com',
                password: 'password123',
            });

            const setCookieHeader = loginResponse.headers['set-cookie'];
            const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
            const refreshTokenCookie = cookies.find((cookie) => cookie?.startsWith('refreshToken='));

            const response = await testRequest.post('/auth/logout').set('Cookie', refreshTokenCookie!);

            expectSuccess(response, 200);

            const refreshToken = await prisma.refreshToken.findFirst({
                where: { userId: user.id },
            });

            expect(refreshToken).toBeNull();
        });

        it('리프레시 토큰이 누락되면 실패해야 함', async () => {
            const response = await testRequest.post('/auth/logout');

            expectError(response, 401);
        });
    });
});
