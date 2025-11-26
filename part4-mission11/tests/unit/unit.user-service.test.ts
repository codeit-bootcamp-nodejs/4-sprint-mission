import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import bcrypt from 'bcrypt';

import AppError from '../../src/lib/appError.js';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../../src/lib/constants.js';
import * as token from '../../src/lib/token.js';
import * as likeRepo from '../../src/repositories/like-repository.js';
import * as userRepo from '../../src/repositories/user-repository.js';
import { userService } from '../../src/services/user-service.js';

/* ──────────────────────────────────────────
   시그니처를 그대로 따르는 안전한 스파이
   (bcrypt는 spy/mocking 금지: 실제 사용)
   ────────────────────────────────────────── */
const spyFindByUsername = jest.spyOn(
  userRepo.userRepository,
  'findByUsername'
) as jest.SpiedFunction<typeof userRepo.userRepository.findByUsername>;

const spyCreateUser = jest.spyOn(
  userRepo.userRepository,
  'createUser'
) as jest.SpiedFunction<typeof userRepo.userRepository.createUser>;

const spyFindById = jest.spyOn(
  userRepo.userRepository,
  'findById'
) as jest.SpiedFunction<typeof userRepo.userRepository.findById>;

const spyFindByIdWithPassword = jest.spyOn(
  userRepo.userRepository,
  'findByIdWithPassword'
) as jest.SpiedFunction<typeof userRepo.userRepository.findByIdWithPassword>;

const spyUpdateUser = jest.spyOn(
  userRepo.userRepository,
  'updateUser'
) as jest.SpiedFunction<typeof userRepo.userRepository.updateUser>;

const spyUpdatePassword = jest.spyOn(
  userRepo.userRepository,
  'updatePassword'
) as jest.SpiedFunction<typeof userRepo.userRepository.updatePassword>;

const spyGetUserComments = jest.spyOn(
  userRepo.userRepository,
  'getUserComments'
) as jest.SpiedFunction<typeof userRepo.userRepository.getUserComments>;

const spyGetUserLikedComments = jest.spyOn(
  userRepo.userRepository,
  'getUserLikedComments'
) as jest.SpiedFunction<typeof userRepo.userRepository.getUserLikedComments>;

const spyLikeCount = jest.spyOn(
  likeRepo.commentLikeRepository,
  'count'
) as jest.SpiedFunction<typeof likeRepo.commentLikeRepository.count>;

const mockGenerateTokens = token.generateTokens as jest.MockedFunction<
  typeof token.generateTokens
>;
const mockVerifyRefresh = token.verifyRefreshToken as jest.MockedFunction<
  typeof token.verifyRefreshToken
>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('UserService', () => {
  /* ───────── register ───────── */
  describe('register', () => {
    test('새 유저 등록 → 비밀번호 해시  비공개 필드 제거', async () => {
      spyFindByUsername.mockResolvedValue(null);

      // 실제 bcrypt로 해시를 만들어서 createUser 리턴에 넣음
      const hashed = await bcrypt.hash('1234', 10);

      type CreatedUser = Awaited<
        ReturnType<typeof userRepo.userRepository.createUser>
      >;
      const createdUser: CreatedUser = {
        id: 1,
        username: 'u',
        email: 'u@ex.com',
        password: hashed,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as CreatedUser;

      spyCreateUser.mockResolvedValue(createdUser);

      const out = await userService.register('u', 'u@ex.com', '1234');

      expect(spyFindByUsername).toHaveBeenCalledWith('u');
      // 해시는 내부에서 수행되므로 createUser 인자만 검증
      expect(spyCreateUser).toHaveBeenCalledWith({
        username: 'u',
        email: 'u@ex.com',
        // 정확한 해시 문자열을 강제할 필요는 없음
        password: expect.any(String),
      });
      expect(out).toEqual(
        expect.objectContaining({
          id: 1,
          username: 'u',
          email: 'u@ex.com',
        })
      );
      expect(out).not.toHaveProperty('password');
    });

    test('닉네임 중복 → 409', async () => {
      spyFindByUsername.mockResolvedValue({ id: 1 } as unknown as NonNullable<
        Awaited<ReturnType<typeof userRepo.userRepository.findByUsername>>
      >);
      await expect(
        userService.register('u', 'u@ex.com', '1234')
      ).rejects.toThrow(AppError);
      await expect(
        userService.register('u', 'u@ex.com', '1234')
      ).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  /* ───────── login ───────── */
  test('login → generateTokens 그대로 반환', async () => {
    expect(jest.isMockFunction(token.generateTokens)).toBe(true);
    mockGenerateTokens.mockReturnValue({
      accessToken: 'acc.token',
      refreshToken: 'ref.token',
    });

    const out = await userService.login(7);

    expect(mockGenerateTokens).toHaveBeenCalledWith(7);
    expect(out).toEqual({
      accessToken: 'acc.token',
      refreshToken: 'ref.token',
    });
  });

  /* ───────── 프로필 조회/수정 ───────── */
  describe('get/update profile', () => {
    test('getUserProfile', async () => {
      type UserLite = Awaited<
        ReturnType<typeof userRepo.userRepository.findById>
      >;
      const userLite: UserLite = { id: 7, username: 'u' } as UserLite;

      spyFindById.mockResolvedValue(userLite);

      const out = await userService.getUserProfile(7);
      expect(spyFindById).toHaveBeenCalledWith(7);
      expect(out).toEqual({ id: 7, username: 'u' });
    });

    test('updateUserProfile', async () => {
      type UserUpdated = Awaited<
        ReturnType<typeof userRepo.userRepository.updateUser>
      >;
      const updated: UserUpdated = {
        id: 7,
        username: 'nu',
      } as unknown as UserUpdated;

      spyUpdateUser.mockResolvedValue(updated);

      const out = await userService.updateUserProfile(7, {
        username: 'nu',
        email: 'e@x.com',
        images: [],
      });

      expect(spyUpdateUser).toHaveBeenCalledWith(7, {
        username: 'nu',
        email: 'e@x.com',
        images: [],
      });
      expect(out).toEqual({ id: 7, username: 'nu' });
    });
  });

  /* ───────── 비밀번호 변경 ───────── */
  describe('updatePassword', () => {
    test('유저 없음 → 404', async () => {
      spyFindByIdWithPassword.mockResolvedValue(null);
      await expect(
        userService.updatePassword(7, 'old', 'new')
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    test('현재 비밀번호 불일치 → 400', async () => {
      const stored = await bcrypt.hash('SOMETHING_ELSE', 10);
      type WithPw = NonNullable<
        Awaited<ReturnType<typeof userRepo.userRepository.findByIdWithPassword>>
      >;
      const withPw: WithPw = { id: 7, password: stored } as WithPw;

      spyFindByIdWithPassword.mockResolvedValue(withPw);

      await expect(
        userService.updatePassword(7, 'wrong', 'new')
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    test('새 비밀번호가 기존과 동일 → 400', async () => {
      const same = await bcrypt.hash('old', 10);
      type WithPw = NonNullable<
        Awaited<ReturnType<typeof userRepo.userRepository.findByIdWithPassword>>
      >;
      const withPw: WithPw = { id: 7, password: same } as WithPw;

      spyFindByIdWithPassword.mockResolvedValue(withPw);

      await expect(
        userService.updatePassword(7, 'old', 'old')
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    test('성공 → 해시 후 업데이트 & password 제외', async () => {
      const stored = await bcrypt.hash('old', 10);
      type WithPw = NonNullable<
        Awaited<ReturnType<typeof userRepo.userRepository.findByIdWithPassword>>
      >;
      const withPw: WithPw = { id: 7, password: stored } as WithPw;
      spyFindByIdWithPassword.mockResolvedValue(withPw);

      // updatePassword가 리턴하는 유저 모양
      type Updated = Awaited<
        ReturnType<typeof userRepo.userRepository.updatePassword>
      >;
      const updated: Updated = {
        id: 7,
        username: 'u',
        email: 'u@ex.com',
        password: await bcrypt.hash('new', 10),
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Updated;
      spyUpdatePassword.mockResolvedValue(updated);

      const out = await userService.updatePassword(7, 'old', 'new');

      expect(spyUpdatePassword).toHaveBeenCalledWith(7, expect.any(String));
      expect(out).toEqual(
        expect.objectContaining({ id: 7, username: 'u', email: 'u@ex.com' })
      );
      expect(out).not.toHaveProperty('password');
    });
  });

  /* ───────── 댓글 집계 ───────── */
  describe('comments aggregation', () => {
    test('getUserComments → likeCount 합성', async () => {
      type Comments = Awaited<
        ReturnType<typeof userRepo.userRepository.getUserComments>
      >;
      const comments: Comments = [
        {
          id: 1,
          content: 'a',
          createdAt: new Date(),
          article: null,
          product: null,
        },
        {
          id: 2,
          content: 'b',
          createdAt: new Date(),
          article: null,
          product: null,
        },
      ] as unknown as Comments;

      spyGetUserComments.mockResolvedValue(comments);
      spyLikeCount.mockResolvedValueOnce(3).mockResolvedValueOnce(5);

      const out = await userService.getUserComments(7);

      expect(spyGetUserComments).toHaveBeenCalledWith(7);
      expect(likeRepo.commentLikeRepository.count).toHaveBeenNthCalledWith(
        1,
        1
      );
      expect(likeRepo.commentLikeRepository.count).toHaveBeenNthCalledWith(
        2,
        2
      );

      expect(out).toEqual([
        expect.objectContaining({ id: 1, likeCount: 3 }),
        expect.objectContaining({ id: 2, likeCount: 5 }),
      ]);
    });

    test('getUserLikedComments → 내부 comment 꺼내서 합성', async () => {
      type Liked = Awaited<
        ReturnType<typeof userRepo.userRepository.getUserLikedComments>
      >;
      const liked: Liked = [
        {
          comment: {
            id: 10,
            content: 'x',
            createdAt: new Date(),
            article: null,
            product: null,
          },
        },
        {
          comment: {
            id: 11,
            content: 'y',
            createdAt: new Date(),
            article: null,
            product: null,
          },
        },
      ] as unknown as Liked;

      spyGetUserLikedComments.mockResolvedValue(liked);
      spyLikeCount.mockResolvedValueOnce(2).mockResolvedValueOnce(0);

      const out = await userService.getUserLikedComments(7);

      expect(spyGetUserLikedComments).toHaveBeenCalledWith(7);
      // 반환 스키마(예: { id, body, likeCount, isLiked })에 맞춰 검증
      expect(out).toEqual([
        expect.objectContaining({ id: 10, likeCount: 2, isLiked: true }),
        expect.objectContaining({ id: 11, likeCount: 0, isLiked: true }),
      ]);
    });
  });

  /* ───────── 토큰 쿠키 ───────── */
  describe('token cookies', () => {
    test('setTokenCookies → 두 쿠키 설정', () => {
      type ResForSet = Parameters<typeof userService.setTokenCookies>[0];
      const resSet = { cookie: jest.fn() } as unknown as ResForSet;

      userService.setTokenCookies(resSet, 'A', 'R');

      expect(resSet.cookie).toHaveBeenCalledTimes(2);
      expect(resSet.cookie).toHaveBeenNthCalledWith(
        1,
        ACCESS_TOKEN_COOKIE_NAME,
        'A',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          maxAge: expect.any(Number),
        })
      );
      expect(resSet.cookie).toHaveBeenNthCalledWith(
        2,
        REFRESH_TOKEN_COOKIE_NAME,
        'R',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          maxAge: expect.any(Number),
          path: '/auth/refresh',
        })
      );
    });

    test('clearTokenCookies', () => {
      type ResForClear = Parameters<typeof userService.clearTokenCookies>[0];
      const resClear = { clearCookie: jest.fn() } as unknown as ResForClear;

      userService.clearTokenCookies(resClear);
      expect(resClear.clearCookie).toHaveBeenCalledWith(
        ACCESS_TOKEN_COOKIE_NAME
      );
      expect(resClear.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_COOKIE_NAME
      );
    });

    test('refreshTokens → verify→generate→setCookie→access 반환', async () => {
      type ResForRefresh = Parameters<typeof userService.refreshTokens>[1];
      const res = { cookie: jest.fn() } as unknown as ResForRefresh;

      mockVerifyRefresh.mockReturnValue({ userId: 7 });
      mockGenerateTokens.mockReturnValue({
        accessToken: 'acc.token',
        refreshToken: 'ref.token',
      });

      const access = await userService.refreshTokens('ref.token', res);

      expect(mockVerifyRefresh).toHaveBeenCalledWith('ref.token');
      expect(mockGenerateTokens).toHaveBeenCalledWith(7);
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(access).toBe('acc.token');
    });
  });
});
