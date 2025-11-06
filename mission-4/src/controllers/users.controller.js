import { prisma } from "../utils/prisma.util.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UsersController {
  // 회원가입
  signUp = async (req, res, next) => {
    try {
      const { password, confirmPassword } = req.body;
      const email = req.body.email?.trim();
      const nickname = req.body.nickname?.trim();

      // 유효성 검사
      if (!email || !password || !confirmPassword || !nickname) {
        return res.status(400).json({ message: "모든 필드 입력해주세요." });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "비밀번호는 6자리 이상이어야 합니다." });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "비밀번호를 확인해주세요" });
      }

      // 이메일, 닉네임 중복 확인
      const isExistUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { nickname }],
        },
      });
      if (isExistUser) {
        return res
          .status(409)
          .json({ message: "이미 사용중인 이메일 또는 닉네임 입니다." });
      }
      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(password, 10);
      // 사용자 생성

      const user = await prisma.user.create({
        data: {
          email,
          nickname,
          password: hashedPassword,
        },
      });

      return res.status(201).json({
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        createdAt: user.createdAt,
      });
    } catch (err) {
      next(err);
    }
  };

  // 로그인
  signIn = async (req, res, next) => {
    try {
      const { password } = req.body;
      const email = req.body.email?.trim();

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "이메일과 비밀번호를 모두 입력해주세요." });
      }

      const user = await prisma.user.findFirst({ where: { email } });
      if (!user) {
        return res
          .status(401)
          .json({ message: "인증 정보가 유효하지 않습니다." });
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
        return res
          .status(401)
          .json({ message: "인증 정보가 유효하지 않습니다." });
      }

      // --- 토큰 생성 로직 변경 ---

      // 1. Access Token 생성 (유효기간: 1시간)
      const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: "1h",
      });

      // 2. Refresh Token 생성 (유효기간: 7일)
      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: "7d" }
      );

      // 3. Refresh Token을 데이터베이스에 저장
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
        },
      });

      // 4. 클라이언트에게 두 토큰 모두 전달
      return res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (err) {
      next(err);
    }
  };

  // 내 정보 조회
  getMe = async (req, res, next) => {
    try {
      //인증 미들웨어에서 req.user에 할당한 사용자 정보 사용
      const user = req.user;
      // 비밀번호 제외
      return res.status(200).json({
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (err) {
      next(err);
    }
  };

  // 유저 정보 수정
  updateMe = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { image } = req.body;
      const nickname = req.body.nickname?.trim();

      // 수정할 정보가 하나도 없는 경우
      if (!nickname && !image) {
        return res.status(400).json({ message: "수정할 정보를 입력해주세요." });
      }

      // 닉네임 수정할 때, 닉네임이 DB에 중복 되는지 확인
      if (nickname) {
        const isExistNickname = await prisma.user.findFirst({
          where: {
            nickname,
            // 자기 자신의 닉네임 중복 검사에서 제외
            id: { not: userId },
          },
        });
        if (isExistNickname) {
          return res
            .status(409)
            .json({ message: "이미 사용중인 닉네임입니다." });
        }
      }
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(nickname && { nickname }),
          ...(image && { image }),
        },
        // 비밀번호를 제외한 사용자 정보 수정
        select: {
          id: true,
          email: true,
          nickname: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({ data: updatedUser });
    } catch (err) {
      next(err);
    }
  };

  // 비밀번호 변경
  updatePassword = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { currentPassword, newPassword, confirmNewPassword } = req.body;

      // 유효성 검사
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: "모든 필드 입력해주세요" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "새로운 비밀번호는 6자 이상 작성해야합니다." });
      }
      if (newPassword !== confirmNewPassword) {
        return res
          .status(400)
          .json({ message: "새로운 비밀번호 일치하지 않습니다." });
      }
      // 현재 비밀번호 확인
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const isPasswordMatched = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordMatched) {
        return res
          .status(401)
          .json({ message: "현재 비밀번호가 일치하지 않습니다." });
      }

      // 새로운 비밀번호와 현재 비밀번호 중복 확인
      if (currentPassword === newPassword) {
        return res
          .status(400)
          .json({ message: "새로운 비밀번호와 현재 비밀번호가 같습니다." });
      }
      // 새로운 비밀번호 해싱 및 업데이트
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });

      // 보안: 비밀번호 변경 시, 해당 유저의 모든 리프레시 토큰 삭제
      await prisma.refreshToken.deleteMany({
        where: { userId: userId },
      });

      return res
        .status(200)
        .json({ message: "비밀번호가 성공적으로 변경되었습니다." });
    } catch (err) {
      next(err);
    }
  };

  // 특정 유저가 등록한 상품 목록 조회
  getMyProducts = async (req, res, next) => {
    try {
      const { id: userId } = req.user;

      const products = await prisma.product.findMany({
        where: { authorId: userId },
        orderBy: {
          createdAt: "desc", // 최신순
        },
      });
      return res.status(200).json({ data: products });
    } catch (err) {
      next(err);
    }
  };

  // 내가 '좋아요' 누른 상품 목록 조회
  getLikedProducts = async (req, res, next) => {
    try {
      const { id: userId } = req.user;

      const likedProducts = await prisma.product.findMany({
        where: {
          likes: {
            some: {
              userId: userId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              nickname: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({ data: likedProducts });
    } catch (err) {
      next(err);
    }
  };

  // Access Token 재발급
  refreshToken = async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return res
          .status(401)
          .json({ message: "Refresh Token이 필요합니다." });
      }

      const [tokenType, refreshToken] = authorization.split(" ");
      if (tokenType !== "Bearer") {
        return res
          .status(401)
          .json({ message: "지원하지 않는 토큰 형식입니다." });
      }

      // 1. Refresh Token 검증 (시그니처, 만료 여부)
      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY
      );
      const userId = decodedToken.userId;

      // 2. 데이터베이스에서 Refresh Token 조회
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken) {
        return res.status(401).json({ message: "유효하지 않은 Refresh Token입니다." });
      }

      // 3. 새로운 Access Token 생성
      const user = storedToken.user;
      const newAccessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: "1h",
      });

      // 4. 새로운 Access Token 발급
      return res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
      // Refresh Token이 만료되었거나, 형식이 잘못된 경우 등
      if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ message: "Refresh Token이 유효하지 않습니다." });
      }
      next(err);
    }
  };

  // 프로필 이미지 업로드
  updateProfileImage = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "이미지 파일 업로드해주세요" });
      }

      const imageUrl = file.path;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { image: imageUrl },
        select: {
          id: true,
          email: true,
          nickname: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return res.status(200).json({
        message: "프로필 이미지가 성공적으로 변경되었습니다.",
        data: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  };
}
