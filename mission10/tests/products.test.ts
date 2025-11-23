import request from 'supertest';
import app from '../src/app';
import prisma from '../src/lib/prismaClient';
import bcrypt from 'bcrypt';
import { ACCESS_TOKEN_COOKIE_NAME } from '../src/lib/constants';
import { productService } from '../src/product/productService';
import { productRepository } from '../src/product/productRepository';
import { io } from '../src/socket/socket';

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
    it('상품 가격을 업데이트하고, 해당 상품을 좋아하는 사용자에게 알림을 보내야 합니다.', async () => {
      // Mock data
      const productId = 1;
      const newPrice = 15000;
      const updatedProduct = { id: productId, name: 'Test Product', price: newPrice };
      const likedUsers = [{ userId: 101 }, { userId: 102 }];
      const message = `좋아요한 상품 "Test Product"의 가격이 15,000원으로 변경되었습니다.`;

      // Mock the repository and socket functions
      (productRepository.updateProductPrice as jest.Mock).mockResolvedValue(updatedProduct);
      (productRepository.findLikedUsers as jest.Mock).mockResolvedValue(likedUsers);

      // Call the service function
      const result = await productService.updatePrice(productId, newPrice);

      // Assertions
      // 1. DB 업데이트 함수가 올바른 인자와 함께 호출되었는지 확인
      expect(productRepository.updateProductPrice).toHaveBeenCalledWith(productId, newPrice);

      // 2. 좋아요한 유저를 찾는 함수가 올바른 인자와 함께 호출되었는지 확인
      expect(productRepository.findLikedUsers).toHaveBeenCalledWith(productId);

      // 3. 각 유저에게 알림이 전송되었는지 확인
      expect(io.to).toHaveBeenCalledTimes(likedUsers.length);
      expect(io.emit).toHaveBeenCalledTimes(likedUsers.length);
      expect(io.to).toHaveBeenCalledWith('user-101');
      expect(io.to).toHaveBeenCalledWith('user-102');
      expect(io.emit).toHaveBeenCalledWith('new-notification', { message });

      // 4. 반환된 결과가 예상과 일치하는지 확인
      expect(result).toEqual(updatedProduct);
    });
  });
});

describe('상품 API', () => {
  let productId: number;
  let testUser: any;
  let userTokenCookie: string;
  let createdProductIds: number[] = [];

  // 테스트 시작 전: 사용자 생성 및 로그인
  beforeAll(async () => {
    // 1. 테스트용 사용자 생성 (비밀번호 암호화)
    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await prisma.user.create({
      data: {
        email: `product-test-${Date.now()}@example.com`,
        nickname: `product-tester-${Date.now()}`,
        password: hashedPassword,
      },
    });

    // 2. 로그인하여 인증 쿠키 획득
    const loginResponse = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: 'password123',
    });
    const cookies = loginResponse.headers['set-cookie'] as unknown as string[];
    const accessTokenCookie = cookies.find(cookie => cookie.startsWith(ACCESS_TOKEN_COOKIE_NAME));
    if (!accessTokenCookie) {
      throw new Error('Access token cookie not found');
    }
    userTokenCookie = accessTokenCookie;
  });

  // 테스트 종료 후: 생성된 데이터 정리
  afterAll(async () => {
    // 생성된 모든 상품 삭제
    if (createdProductIds.length > 0) {
      await prisma.product.deleteMany({
        where: { id: { in: createdProductIds } },
      });
    }
    // 생성된 사용자 삭제
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } });
    }
  });

  describe('POST /products (상품 생성)', () => {
    it('성공: 인증된 사용자가 상품을 생성합니다', async () => {
      const productData = {
        name: 'Test Product',
        description: 'This is a test product.',
        price: 10000,
        images: [],
        tags: ['test'],
      };

      const response = await request(app)
        .post('/products')
        .set('Cookie', userTokenCookie)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(productData.name);
      
      // 생성된 상품 ID를 저장하여 afterAll에서 삭제
      createdProductIds.push(response.body.id);
      productId = response.body.id; // 다른 테스트에서 사용하기 위해 저장
    });

    it('실패: 인증되지 않은 사용자는 401 에러를 반환해야 합니다', async () => {
      const productData = {
        name: 'Unauthorized Product',
        description: 'This should not be created.',
        price: 5000,
      };

      const response = await request(app).post('/products').send(productData);
      expect(response.status).toBe(401);
    });
  });

  describe('GET /products', () => {
    it('올바른 구조의 상품 목록을 반환해야 합니다', async () => {
      const response = await request(app).get('/products');
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
    });
  });

  describe('GET /products/:id', () => {
    it('유효한 ID로 단일 상품을 반환해야 합니다', async () => {
      // Ensure productId is set from the previous test
      if (!productId) {
        console.log('Skipping test because no products were found to test with.');
        return;
      }

      const response = await request(app).get(`/products/${productId}`);
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
    });

    it('유효하지 않은 ID의 경우 404를 반환해야 합니다', async () => {
      const response = await request(app).get('/products/999999');
      expect(response.status).toBe(404);
    });
  });

  describe('GET /products/:id/comments', () => {
    it('특정 상품의 댓글 목록을 반환해야 합니다', async () => {
      if (!productId) {
        console.log('Skipping test because no products were found to test with.');
        return;
      }

      const response = await request(app).get(`/products/${productId}/comments`);
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
    });
  });
});
