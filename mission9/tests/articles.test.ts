import request from 'supertest';
import app from '../src/app';
import prisma from '../src/lib/prismaClient';
import bcrypt from 'bcrypt';
import { ACCESS_TOKEN_COOKIE_NAME } from '../src/lib/constants';

describe('게시글 API', () => { //게시글 API테스트 전체 블록
  let articleId: number; //게시글 id를 저장할 변수
  let testUser: any; //테스트 사용자
  let otherUser: any; //다른 사용자
  let userTokenCookie: string;  // 로그인 상태를 유지하기 위한 인증 토큰
  let createdArticleIds: number[] = []; //생성된 게시글의 아이디 목록

  beforeAll(async () => { //테스트 실행 전 1회
    const salt = 10; //비밀번호 해싱용 솔트값
    const password = 'password123'; //공통비밀번호
    const usersData = [//두명의 테스트 정의
      {
        email: `article-test-${Date.now()}@example.com`, //테스트용 이메일 주소를 매번 고유하게 생성
        nickname: `article-tester-${Date.now()}`, //닉네임 값도 매번 고유하게 생성
        password: await bcrypt.hash(password, salt), //비밀번호를 단방향해싱
      },
      {
        email: `article-other-${Date.now()}@example.com`,
        nickname: `article-other-${Date.now()}`,
        password: await bcrypt.hash(password, salt),
      },
    ];
    [testUser, otherUser] = await Promise.all( //두명의 테스트정보를 디비에 저장 후 결과 동시에 반환 //프로미스 올: 동시에 실행하고 모두 끝날때까지 기다리기
      usersData.map(data => prisma.user.create({ data })) //배열에 들어 있는 여러 사용자 데이터를 한 번에 DB에 저장할 준비를 하는 코드
    );//map은 배열의 각 요소를 변환하는 함수

    const loginResponse = await request(app).post('/auth/login').send({ //Supertest 라이브러리를 엔드포인트로 생성 후 보내라
      email: testUser.email,  //이 내용들을
      password: password,
    });
    const cookies = loginResponse.headers['set-cookie'] as unknown as string[];//TypeScript에게 “이건 문자열 배열이야”라고 알려주는 타입 단언
    const accessTokenCookie = cookies.find(cookie => cookie.startsWith(ACCESS_TOKEN_COOKIE_NAME));//cookie.startsWith(...) : 문자열이 특정 단어로 시작하는지 확인
    if (!accessTokenCookie) {
      throw new Error('Access token cookie not found');
    }
    userTokenCookie = accessTokenCookie;
  });

  afterAll(async () => {// 모든 테스트가 끝난 뒤,테스트용으로 DB에 만들어졌던 게시글과 사용자 데이터를 지워주는 코드
    if (createdArticleIds.length > 0) {//아이디 배열 갯수가 0보다 크면
      await prisma.article.deleteMany({ where: { id: { in: createdArticleIds } } });
    }
    await prisma.user.deleteMany({ where: { id: { in: [testUser.id, otherUser.id] } } });
  });

  describe('POST /articles (게시글 생성)', () => {
    it('성공: 인증된 사용자가 게시글을 생성합니다', async () => {
      const articleData = { title: 'New Article', content: 'This is a test article.', image: null };
      const response = await request(app)
        .post('/articles')
        .set('Cookie', userTokenCookie)  //로그인한 상태
        .send(articleData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id'); //toHaveProperty = “이 안에 그 아이디의 정보가 있나?
      expect(response.body.title).toBe(articleData.title);
      createdArticleIds.push(response.body.id);
      articleId = response.body.id;
    });

    it('실패: 인증되지 않은 사용자는 401 에러를 반환해야 합니다', async () => {
      const articleData = { title: 'Unauthorized Article', content: 'This should not be created.', image: null };
      const response = await request(app).post('/articles').send(articleData);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /articles/:id (게시글 수정)', () => {
    it('성공: 게시글 작성자가 내용을 수정합니다', async () => {
      const updatedData = { title: 'Updated Title', image: null };
      const response = await request(app)
        .patch(`/articles/${articleId}`)
        .set('Cookie', userTokenCookie)
        .send(updatedData);
      
      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updatedData.title);
    });

    it('실패: 작성자가 아닌 사용자는 403 에러를 반환해야 합니다', async () => {
      const otherUserLogin = await request(app).post('/auth/login').send({
        email: otherUser.email,
        password: 'password123',
      });
      const otherUserCookie = (otherUserLogin.headers['set-cookie'] as unknown as string[]).find(c => c.startsWith(ACCESS_TOKEN_COOKIE_NAME));

      const updatedData = { title: 'Forbidden Update', image: null };
      const response = await request(app)
        .patch(`/articles/${articleId}`)
        .set('Cookie', otherUserCookie!)
        .send(updatedData);
      
      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /articles/:id (게시글 삭제)', () => {
    it('실패: 작성자가 아닌 사용자는 403 에러를 반환해야 합니다', async () => {
        const otherUserLogin = await request(app).post('/auth/login').send({
            email: otherUser.email,
            password: 'password123',
        });
        const otherUserCookie = (otherUserLogin.headers['set-cookie'] as unknown as string[]).find(c => c.startsWith(ACCESS_TOKEN_COOKIE_NAME));

        const response = await request(app)
            .delete(`/articles/${articleId}`)
            .set('Cookie', otherUserCookie!);
        
        expect(response.status).toBe(403);
    });

    it('성공: 게시글 작성자가 게시글을 삭제합니다', async () => {
        const response = await request(app)
            .delete(`/articles/${articleId}`)
            .set('Cookie', userTokenCookie);
        
        expect(response.status).toBe(204);
    });
  });

  describe('GET /articles', () => {
    it('올바른 구조의 게시글 목록을 반환해야 합니다', async () => {
      const response = await request(app).get('/articles');
      expect(response.status).toBe(200);
      expect(response.body.list).toBeInstanceOf(Array);
    });
  });

  describe('GET /articles/:id', () => {
    it('삭제된 게시글 조회 시 404를 반환해야 합니다', async () => {
      const response = await request(app).get(`/articles/${articleId}`);
      expect(response.status).toBe(404);
    });
  });
});
