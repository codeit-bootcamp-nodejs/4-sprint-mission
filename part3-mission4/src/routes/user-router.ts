import express from 'express';
import { userController } from '../controllers/user-controller.js';
import { productController } from '../controllers/product-controller.js';
import { validation } from '../middlewares/validation.js';
import passport from '../lib/passport/index.js';
import authenticate from '../middlewares/authenticate.js';
import { isUserSelf } from '../middlewares/authorize.js';
import { articleController } from '../controllers/article-controller.js';

const router = express.Router();

// 등록
/**
 * @openapi
 * /register:
 *   post:
 *     summary: 회원가입
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "shim"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "shim@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "mypassword123"
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: "shim"
 *                     email:
 *                       type: string
 *                       example: "shim@example.com"
 *                 message:
 *                   type: string
 *                   example: "회원 가입 성공!"
 *       409:
 *         description: 닉네임 중복입니다.
 */
router.post('/register', validation.validateUsername, userController.register);

// 로그인&로그아웃
/**
 * @openapi
 * /login:
 *   post:
 *     summary: 로그인
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "mypassword123"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken :
 *                       type: string
 *                       example: "abcdefg"
 *                     refreshToken:
 *                       type: string
 *                       example: "abcdefg"
 *                 message:
 *                   type: string
 *                   example: "로그인 성공!"
 *       403:
 *         description: '아이디 혹은 패스워드가 일치하지 않습니다'
 */
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  userController.login
);

// 로그인&로그아웃
/**
 * @openapi
 * /logout:
 *   post:
 *     summary: 로그아웃
 *     tags:
 *       - User
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그아웃 되었습니다."
 *       401:
 *         description: 인증되지 않은 사용자
 */
router.post('/logout', userController.logout);

// 유저 조회, 정보 수정
/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     summary: 유저 프로필 조회
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 유저 ID
 *     responses:
 *       200:
 *         description: 프로필 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 images:
 *                   type: array
 *                   items:
 *                    type: string
 *       401:
 *         description: 인증되지 않은 사용자
 *       403:
 *         description: 자기 자신의 프로필만 조회 가능
 */

/**
 * @openapi
 * /users/{userId}:
 *   patch:
 *     summary: 유저 프로필 수정
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 유저 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "newname"
 *               email:
 *                 type: string
 *                 example: "newemail@example.com"
 *               images:
 *                 type: array
 *                 items:
 *                  type: string
 *                 example: ["image1.jpg", "image2.png"]
 *     responses:
 *       200:
 *         description: 프로필 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   type: object
 *                   properties:
 *                      id:
 *                        type: integer
 *                      username:
 *                        type: string
 *                      email:
 *                        type: string
 *                      images:
 *                        type: array
 *                        items:
 *                         type: string
 *                        example: ["image1.jpg", "image2.png"]
 *       401:
 *         description: 인증되지 않은 사용자
 *       403:
 *         description: 자기 자신의 프로필만 수정 가능
 */
router
  .route('/:userId')
  .get(
    authenticate,
    isUserSelf,
    validation.validateParam('userId', validation.idSchema),
    userController.getUserProfile
  )
  .patch(
    authenticate,
    isUserSelf,
    validation.validateParam('userId', validation.idSchema),
    userController.updateUserProfile
  );

// 유저 비밀번호 수정
/**
 * @openapi
 * /users/{userId}/password:
 *   patch:
 *     summary: 비밀번호 변경
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 유저 비밀번호 변경
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: true
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "password"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword"
 *               newPasswordConfirm:
 *                 type: string
 *                 example: "newpassword"
 *     responses:
 *       200:
 *         description: 비밀번호 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "비밀번호가 변경되었습니다."
 *       400:
 *         description: "새 비밀번호가 일치하지 않습니다."
 *       404:
 *         description: "사용자를 찾을 수 없습니다."
 */
router.patch(
  '/:userId/password',
  authenticate,
  isUserSelf,
  userController.updatePassword
);

// 자신의 상품, 게시글, 댓글 조회
/**
 * @openapi
 * /users/{userId}/my-products:
 *   get:
 *     summary: 자신이 등록한 상품 조회
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 유저 id
 *     responses:
 *       200:
 *         description: 자신이 등록한 상품 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: "1"
 *                 name:
 *                   type: string
 *                   example: "name"
 *                 description:
 *                   type: string
 *                   example: "description"
 *                 price:
 *                   type: integer
 *                   example: "10000"
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["tag1", "tag2"]
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["image1.jpg", "image2.png"]
 *                 likeCount:
 *                   type: integer
 *                   example: "1"
 *       403:
 *         description: "권한이 없습니다."
 */
/**
 * @openapi
 * /users/{userId}/my-articles:
 *   get:
 *     summary: 자신이 등록한 게시글 조회
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 유저 id
 *     responses:
 *       200:
 *         description: 자신이 등록한 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: "1"
 *                 title:
 *                   type: string
 *                   example: "title"
 *                 content:
 *                   type: string
 *                   example: "content"
 *                 price:
 *                   type: integer
 *                   example: "10000"
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["tag1", "tag2"]
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["image1.jpg", "image2.png"]
 *                 likeCount:
 *                   type: integer
 *                   example: "1"
 *       403:
 *         description: "권한이 없습니다."
 */
/**
 * @openapi
 * /users/{userId}/my-comments:
 *   get:
 *     summary: 자신이 등록한 댓글 조회
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 유저 ID
 *     responses:
 *       200:
 *         description: 자신이 등록한 댓글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   content:
 *                     type: string
 *                     example: "댓글 내용입니다."
 *                   article:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "게시글 제목"
 *                   product:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: "상품명"
 *                   likeCount:
 *                     type: integer
 *                     example: 5
 *       403:
 *         description: "권한이 없습니다."
 */
router.get(
  '/:userId/my-products',
  authenticate,
  isUserSelf,
  validation.validateParam('userId', validation.idSchema),
  productController.getUserProducts
);
router.get(
  '/:userId/my-articles',
  authenticate,
  isUserSelf,
  validation.validateParam('userId', validation.idSchema),
  articleController.getUserArticles
);
router.get(
  '/:userId/my-comments',
  authenticate,
  isUserSelf,
  validation.validateParam('userId', validation.idSchema),
  userController.getUserComments
);

// 좋아요한 상품, 게시글, 댓글 조회
router.get(
  '/:userId/likes/products',
  authenticate,
  isUserSelf,
  validation.validateParam('userId', validation.idSchema),
  userController.getUserLikedProducts
);

router.get(
  '/:userId/likes/articles',
  authenticate,
  isUserSelf,
  validation.validateParam('userId', validation.idSchema),
  userController.getUserLikedArticles
);

router.get(
  '/:userId/likes/comments',
  authenticate,
  isUserSelf,
  validation.validateParam('userId', validation.idSchema),
  userController.getUserLikedComments
);

export default router;
