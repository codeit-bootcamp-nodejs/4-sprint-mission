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
const productService_1 = require("../src/product/productService");
const productRepository_1 = require("../src/product/productRepository");
const socket_1 = require("../src/socket/socket");
// Mock a an entire module
jest.mock('../src/product/productRepository');
jest.mock('../src/socket/socket', () => ({
    io: {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
    },
}));
describe('상품 서비스 유닛 테스트', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('updatePrice', () => {
        it('상품 가격을 업데이트하고, 해당 상품을 좋아하는 사용자에게 알림을 보내야 합니다.', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const productId = 1;
            const newPrice = 15000;
            const updatedProduct = { id: productId, name: 'Test Product', price: newPrice };
            const likedUsers = [{ userId: 101 }, { userId: 102 }];
            const message = `좋아요한 상품 "Test Product"의 가격이 15,000원으로 변경되었습니다.`;
            // Mock the repository and socket functions
            productRepository_1.productRepository.updateProductPrice.mockResolvedValue(updatedProduct);
            productRepository_1.productRepository.findLikedUsers.mockResolvedValue(likedUsers);
            // Call the service function
            const result = yield productService_1.productService.updatePrice(productId, newPrice);
            // Assertions
            // 1. DB 업데이트 함수가 올바른 인자와 함께 호출되었는지 확인
            expect(productRepository_1.productRepository.updateProductPrice).toHaveBeenCalledWith(productId, newPrice);
            // 2. 좋아요한 유저를 찾는 함수가 올바른 인자와 함께 호출되었는지 확인
            expect(productRepository_1.productRepository.findLikedUsers).toHaveBeenCalledWith(productId);
            // 3. 각 유저에게 알림이 전송되었는지 확인
            expect(socket_1.io.to).toHaveBeenCalledTimes(likedUsers.length);
            expect(socket_1.io.emit).toHaveBeenCalledTimes(likedUsers.length);
            expect(socket_1.io.to).toHaveBeenCalledWith('user-101');
            expect(socket_1.io.to).toHaveBeenCalledWith('user-102');
            expect(socket_1.io.emit).toHaveBeenCalledWith('new-notification', { message });
            // 4. 반환된 결과가 예상과 일치하는지 확인
            expect(result).toEqual(updatedProduct);
        }));
    });
});
describe('상품 API', () => {
    let productId;
    let testUser;
    let userTokenCookie;
    let createdProductIds = [];
    // 테스트 시작 전: 사용자 생성 및 로그인
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // 1. 테스트용 사용자 생성 (비밀번호 암호화)
        const hashedPassword = yield bcrypt_1.default.hash('password123', 10);
        testUser = yield prismaClient_1.default.user.create({
            data: {
                email: `product-test-${Date.now()}@example.com`,
                nickname: `product-tester-${Date.now()}`,
                password: hashedPassword,
            },
        });
        // 2. 로그인하여 인증 쿠키 획득
        const loginResponse = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({
            email: testUser.email,
            password: 'password123',
        });
        const cookies = loginResponse.headers['set-cookie'];
        const accessTokenCookie = cookies.find(cookie => cookie.startsWith(constants_1.ACCESS_TOKEN_COOKIE_NAME));
        if (!accessTokenCookie) {
            throw new Error('Access token cookie not found');
        }
        userTokenCookie = accessTokenCookie;
    }));
    // 테스트 종료 후: 생성된 데이터 정리
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // 생성된 모든 상품 삭제
        if (createdProductIds.length > 0) {
            yield prismaClient_1.default.product.deleteMany({
                where: { id: { in: createdProductIds } },
            });
        }
        // 생성된 사용자 삭제
        if (testUser) {
            yield prismaClient_1.default.user.delete({ where: { id: testUser.id } });
        }
    }));
    describe('POST /products (상품 생성)', () => {
        it('성공: 인증된 사용자가 상품을 생성합니다', () => __awaiter(void 0, void 0, void 0, function* () {
            const productData = {
                name: 'Test Product',
                description: 'This is a test product.',
                price: 10000,
                images: [],
                tags: ['test'],
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/products')
                .set('Cookie', userTokenCookie)
                .send(productData);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(productData.name);
            // 생성된 상품 ID를 저장하여 afterAll에서 삭제
            createdProductIds.push(response.body.id);
            productId = response.body.id; // 다른 테스트에서 사용하기 위해 저장
        }));
        it('실패: 인증되지 않은 사용자는 401 에러를 반환해야 합니다', () => __awaiter(void 0, void 0, void 0, function* () {
            const productData = {
                name: 'Unauthorized Product',
                description: 'This should not be created.',
                price: 5000,
            };
            const response = yield (0, supertest_1.default)(app_1.default).post('/products').send(productData);
            expect(response.status).toBe(401);
        }));
    });
    describe('GET /products', () => {
        it('올바른 구조의 상품 목록을 반환해야 합니다', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get('/products');
            expect(response.status).toBe(200);
            expect(response.body.list).toBeInstanceOf(Array);
            // Store the id of the first product for later tests
            if (response.body.list.length > 0) {
                const product = response.body.list[0];
                // productId = product.id; // 이제 POST 테스트에서 productId를 설정하므로 주석 처리
                // Check the structure of the product object
                expect(typeof product.id).toBe('number');
                expect(typeof product.name).toBe('string');
                expect(typeof product.description).toBe('string');
                expect(typeof product.price).toBe('number');
                expect(typeof product.user).toBe('object');
                expect(typeof product.user.id).toBe('number');
                expect(typeof product.user.nickname).toBe('string');
            }
        }));
    });
    describe('GET /products/:id', () => {
        it('유효한 ID로 단일 상품을 반환해야 합니다', () => __awaiter(void 0, void 0, void 0, function* () {
            // Ensure productId is set from the previous test
            if (!productId) {
                console.log('Skipping test because no products were found to test with.');
                return;
            }
            const response = yield (0, supertest_1.default)(app_1.default).get(`/products/${productId}`);
            expect(response.status).toBe(200);
            const product = response.body;
            expect(product.id).toBe(productId);
            expect(typeof product.name).toBe('string');
            expect(typeof product.description).toBe('string');
            expect(typeof product.price).toBe('number');
            expect(product.tags).toBeInstanceOf(Array);
            expect(product.images).toBeInstanceOf(Array);
            expect(typeof product.user).toBe('object');
            expect(typeof product.user.id).toBe('number');
            expect(typeof product.user.nickname).toBe('string');
        }));
        it('유효하지 않은 ID의 경우 404를 반환해야 합니다', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get('/products/999999');
            expect(response.status).toBe(404);
        }));
    });
    describe('GET /products/:id/comments', () => {
        it('특정 상품의 댓글 목록을 반환해야 합니다', () => __awaiter(void 0, void 0, void 0, function* () {
            if (!productId) {
                console.log('Skipping test because no products were found to test with.');
                return;
            }
            const response = yield (0, supertest_1.default)(app_1.default).get(`/products/${productId}/comments`);
            expect(response.status).toBe(200);
            expect(response.body.list).toBeInstanceOf(Array);
            if (response.body.list.length > 0) {
                const comment = response.body.list[0];
                expect(typeof comment.id).toBe('number');
                expect(typeof comment.content).toBe('string');
                expect(typeof comment.user).toBe('object');
                expect(typeof comment.user.id).toBe('number');
                expect(typeof comment.user.nickname).toBe('string');
            }
        }));
    });
});
