  import request from 'supertest';
import { app, io } from '../app';
import { prisma } from '../utils/prisma.util';
import { UsersService } from '../services/users.service'; // Import UsersService
import { SignUpDto } from '../dtos/user.dto'; // Import SignUpDto

describe('Auth API Integration Tests', () => {
  let usersService: UsersService; // Declare usersService

  beforeEach(async () => {
    usersService = new UsersService(); // Instantiate UsersService

    await prisma.$transaction([
      prisma.productLike.deleteMany(),
      prisma.comment.deleteMany(),
      prisma.articleLike.deleteMany(),
      prisma.article.deleteMany(),
      prisma.product.deleteMany(),
      prisma.refreshToken.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    io.close();
  });

  it('should allow a user to sign up successfully', async () => {
    const userData: SignUpDto = {
      email: 'signup@example.com',
      nickname: 'signupuser',
      password: 'password123',
      confirmPassword: 'password123',
    };

    const res = await request(app).post('/api/signup').send(userData);

    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('email', userData.email);
    expect(res.body.data).toHaveProperty('nickname', userData.nickname);

    const userInDb = await prisma.user.findUnique({ where: { email: userData.email } });
    expect(userInDb).not.toBeNull();
    expect(userInDb?.email).toEqual(userData.email);
  });

  it('should prevent signup with an existing email', async () => {
    const existingEmail = 'existing@example.com';
    // Use usersService.signUp to create the user with hashed password
    await usersService.signUp({
      email: existingEmail,
      nickname: 'existinguser',
      password: 'password123',
      confirmPassword: 'password123',
    });

    const userData: SignUpDto = {
      email: existingEmail,
      nickname: 'newuser',
      password: 'newpassword',
      confirmPassword: 'newpassword',
    };

    const res = await request(app).post('/api/signup').send(userData);

    expect(res.statusCode).toEqual(409); // Conflict status code
    expect(res.body).toHaveProperty('message', '이미 사용중인 이메일 또는 닉네임 입니다.');
  });

  it('should allow a user to log in successfully and receive tokens', async () => {
    const email = 'login@example.com';
    const password = 'password123';
    // Use usersService.signUp to create the user with hashed password
    await usersService.signUp({
      email,
      nickname: 'loginuser',
      password,
      confirmPassword: password,
    });

    const res = await request(app).post('/api/login').send({ email, password });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
  });

  it('should prevent login with incorrect credentials', async () => {
    const email = 'wrong@example.com';
    const password = 'wrongpassword';

    const res = await request(app).post('/api/login').send({ email, password });

    expect(res.statusCode).toEqual(401); // Unauthorized
    expect(res.body).toHaveProperty('message', '인증 정보가 유효하지 않습니다.');
  });
});