import request from "supertest";
import app from "../app";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

describe("User API 통합 테스트 (JWT 기반)", () => {
  const testUser = {
    email: "user_test@example.com",
    nickname: "original_nickname",
    password: "password123",
  };

  const testUser2 = {
    email: "user_test2@example.com",
    nickname: "other_user",
    password: "password456",
  };

  let token: string;
  let cookie: string;
  let testUserId: number;
  let user2Id: number;
  let userProduct: any; // 테스트 유저가 작성한 상품
  let likedProduct: any; // 테스트 유저가 좋아요 누른 상품

  const ACCESS_TOKEN_COOKIE_NAME = "access-token";

  beforeAll(async () => {
    // 테스트 유저1 등록
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    const user = await prisma.user.upsert({
      where: { email: testUser.email },
      update: {},
      create: {
        email: testUser.email,
        nickname: testUser.nickname,
        password: hashedPassword,
      },
    });
    testUserId = user.id;

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    token = loginRes.body.token;
    cookie = `${ACCESS_TOKEN_COOKIE_NAME}=${token}; Path=/`;

    // 테스트 유저1 등록
    const user2HashedPassword = await bcrypt.hash(testUser2.password, 10);
    const user2 = await prisma.user.upsert({
      where: { email: testUser2.email },
      update: {},
      create: {
        email: testUser2.email,
        nickname: testUser2.nickname,
        password: user2HashedPassword,
      },
    });
    user2Id = user2.id;

    // 3. 테스트 유저가 작성한 상품 생성
    userProduct = await prisma.product.create({
      data: {
        name: "내 상품",
        description: "내가 작성한 상품입니다.",
        price: 50000,
        tags: ["own"],
        userId: testUserId,
      },
    });

    // 4. 테스트 유저가 좋아요 누를 상품 생성 (user2가 작성)
    likedProduct = await prisma.product.create({
      data: {
        name: "좋아요 상품",
        description: "좋아요 누를 상품입니다.",
        price: 10000,
        tags: ["like"],
        userId: user2Id,
        like: {
          create: {
            userId: testUserId, // testUser가 좋아요 누름
          },
        },
      },
      include: {
        user: true,
        _count: {
          select: { like: true },
        },
      },
    });
  });

  afterAll(async () => {
    // 1. 좋아요 관계 삭제 (likedProduct를 삭제하기 전에)
    await prisma.like.deleteMany({
      where: {
        userId: testUserId,
        productId: likedProduct.id,
      },
    });

    // 2. 상품 삭제
    await prisma.product.deleteMany({
      where: {
        id: { in: [userProduct.id, likedProduct.id] },
      },
    });

    // 3. 유저 삭제
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testUser.email, testUser2.email],
        },
      },
    });

    await prisma.$disconnect();
  });

  describe("GET /me", () => {
    it("인증된 사용자는 자신의 정보를 성공적으로 조회해야 한다. (200 OK)", async () => {
      const res = await request(app)
        .get("/me")
        .set("Cookie", cookie)
        .expect(200);

      expect(res.body.id).toBe(testUserId);
      expect(res.body.email).toBe(testUser.email);
      expect(res.body.nickname).toBe(testUser.nickname);
      expect(res.body).not.toHaveProperty("password"); // 비밀번호는 제외되어야 함
    });

    it("인증되지 않은 사용자는 401 Unauthorized를 반환해야 한다.", async () => {
      await request(app).get("/me").expect(401);
    });
  });

  describe("PATCH /users", () => {
    it("사용자 정보 수정 성공 시 200 OK와 수정된 정보를 반환해야 한다.", async () => {
      const updatedData = {
        nickname: "new_test_nickname",
        image: "http://example.com/new_image.jpg",
      };

      const res = await request(app)
        .patch("/me")
        .set("Cookie", cookie)
        .send(updatedData)
        .expect(200);

      expect(res.body.nickname).toBe(updatedData.nickname);
      expect(res.body.image).toBe(updatedData.image);
    });

    it("인증되지 않은 사용자는 정보 수정 시 401 Unauthorized를 반환해야 한다.", async () => {
      await request(app).patch("/me").send({ nickname: "fail" }).expect(401);
    });
  });

  describe("PATCH /users/password", () => {
    it("새로운 비밀번호로 변경 성공 시 200 OK를 반환해야 한다.", async () => {
      const newPassword = "new_secure_password";

      await request(app)
        .patch("/me/password")
        .set("Cookie", cookie)
        .send({ password: newPassword })
        .expect(200);

      // 데이터베이스에서 실제 비밀번호가 변경되었는지 확인
      const userAfterUpdate = await prisma.user.findUnique({
        where: { id: testUserId },
        select: { password: true },
      });

      expect(userAfterUpdate).not.toBeNull();
      // 변경된 비밀번호로 로그인 성공하는지 확인 (선택적: 여기서는 DB로 직접 검증)
      const isPasswordCorrect = await bcrypt.compare(
        newPassword,
        userAfterUpdate!.password
      );
      expect(isPasswordCorrect).toBe(true);

      // 다음 테스트를 위해 비밀번호를 다시 원래대로 돌려놓습니다.
      const originalHashedPassword = await bcrypt.hash(testUser.password, 10);
      await prisma.user.update({
        where: { id: testUserId },
        data: { password: originalHashedPassword },
      });
    });

    it("현재 비밀번호와 동일한 비밀번호로 변경 시도 시 400 Bad Request를 반환해야 한다.", async () => {
      // testUser.password는 현재 DB에 저장된 비밀번호와 일치함
      await request(app)
        .patch("/me/password")
        .set("Cookie", cookie)
        .send({ password: testUser.password })
        .expect(400); // "현재 비밀번호와 동일합니다." 에러
    });

    it("인증되지 않은 사용자는 비밀번호 변경 시 401 Unauthorized를 반환해야 한다.", async () => {
      await request(app)
        .patch("/me/password")
        .send({ password: "fail" })
        .expect(401);
    });
  });

  describe("GET /me/products", () => {
    it("사용자가 작성한 상품 목록을 성공적으로 조회해야 한다. (200 OK)", async () => {
      const res = await request(app)
        .get("/me/products")
        .set("Cookie", cookie)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body.some((p: any) => p.id === userProduct.id)).toBe(true);
      expect(res.body[0]).toHaveProperty("name");
      expect(res.body[0]).not.toHaveProperty("userId"); // 사용자 ID는 제외
    });
  });

  describe("GET /me/like-products", () => {
    it("사용자가 좋아요를 누른 상품 목록을 성공적으로 조회해야 한다. (200 OK)", async () => {
      const res = await request(app)
        .get("/me/like-products")
        .set("Cookie", cookie)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);

      const product = res.body.find((p: any) => p.id === likedProduct.id);

      expect(product).toBeDefined();
      expect(product.id).toBe(likedProduct.id);
      expect(product.user.nickname).toBe(testUser2.nickname); // 상품 작성자는 user2
      expect(product.isLiked).toBe(true); // 좋아요 상태 확인
      expect(product._count.like).toBe(1); // 좋아요 개수 확인
    });
  });
});
