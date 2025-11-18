import type { Request, Response, NextFunction } from "express";
import {
  editPasswordService,
  editUserService,
  inquiryService,
  listupService,
  loginService,
  refreshService,
  signupService,
  googleOAuthService,
} from "../services/user.service.js";
import { HttpError } from "../middlewares/errorHandler.middleware.js";
import passport from "../config/passport.config.js";

// select 대신에 include 를 사용하면 관계된 다른 테이블 데이터 까지 같이 가져올 수 있음.

// 회원가입 기능 구현
export async function signupController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 이메일과 패스워드 프론트에서 가져오기
    const { email, nickname, password } = req.body as {
      email: string;
      nickname: string;
      password: string;
    };

    // 서비스 로직
    const newUser = await signupService(email, nickname, password);

    // 응답
    res.status(201).json({
      message: "회원가입 성공",
      user: newUser,
    });
  } catch (err) {
    next(err);
  }
}

// 로그인 기능 구현
export async function loginController(req:Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // email과 password 프론트에서 받아오기
    const { email, password } = req.body as {
      email: string;
      password: string;
    }

    // 서비스 로직
    const { safeuser, accessToken, refreshToken } = await loginService(
      email,
      password
    );

    // 응답
    res.status(200).json({
      message: "로그인 성공",
      user: safeuser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

//  내 정보 조회
export async function inquiryController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 로그인시 발급한 토큰 가져오기
    const userIdStr = req.user?.userId;
    if (!userIdStr) throw new HttpError("유저 정보가 없습니다.", 401);
    
    const userId = Number(userIdStr);
    // 서비스 로직
    const inquiryUser = await inquiryService(userId);

    // 응답
    res.status(200).json({
      message: "내 정보 조회 성공",
      user: inquiryUser,
    });
  } catch (err) {
    next(err);
  }
}

// 내 정보 수정
export async function editUserController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 토큰에서 id정보 가져오기
    const userIdStr = req.user?.userId;
    if (!userIdStr) throw new HttpError("유저 정보가 없습니다.", 401);
    
    const userId = Number(userIdStr);
    // 수정할 값들 꺼내오기
    const { password, nickname, email, image } = req.body as {
      password: string;
      nickname: string;
      email: string;
      image: string | null;
    };

    // 서비스 로직
    const updatedUser = await editUserService(userId, {
      password,
      nickname,
      email,
      image,
    });

    // 응답
    res.status(200).json({
      message: "수정 완료",
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
}

// 내 비밀번호 수정
export async function editPasswordController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 토큰에서 id 정보 가져오기
     const userIdStr = req.user?.userId;
    if (!userIdStr) throw new HttpError("유저 정보가 없습니다.", 401);
    
    const userId = Number(userIdStr);

    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };

    // 서비스 로직
    const updatedPassword = await editPasswordService(userId, 
      currentPassword,
      newPassword,
    );

    // 응답
    res.status(200).json({
      message: "비밀번호가 성공적으로 변경되었습니다.",
      data: updatedPassword,
    });
  } catch (err) {
    next(err);
  }
}

// Refresh Token을 이용해 Access Token 재발급
export async function refreshController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body as {
      refreshToken: string;
    }

    // 서비스 로직
    const newAccessToken = await refreshService(refreshToken);

    res.status(200).json({
      message: "토큰 재발급 성공",
      accesToken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
}

// 등록한 상품의 목록 조회 기능
// 코드 구현간에 상품 아이디를 DB에서 가져와서 있는지 확인하고 보내야하는줄 알고 불필요한 코드를 잘못 작성하여서 수정했음.
export async function listupController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userIdStr = req.user?.userId;
    if (!userIdStr) throw new HttpError("유저 정보가 없습니다.", 401);
    
    const userId = Number(userIdStr);

    // 서비스 로직
    const listup = await listupService(userId);

    // 응답
    res.status(200).json({
      message: "등록한 상품 목록 조회 성공",
      data: listup,
    });
  } catch (err) {
    next(err);
  }
}

// Google OAuth 시작
export async function googleAuthController(req: Request, res: Response, next: NextFunction): Promise<void> {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
}

// Google OAuth 콜백
export async function googleAuthCallbackController(req: Request, res: Response, next: NextFunction): Promise<void> {
  passport.authenticate("google", async (err: any, profile: any) => {
    try {
      if (err) {
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=google_auth_failed`);
      }

      if (!profile) {
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=no_profile`);
      }

      const { safeuser, accessToken, refreshToken, isNewUser } = await googleOAuthService(profile);

      // 프론트엔드로 리디렉션하면서 토큰을 쿼리 파라미터로 전달
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const redirectUrl = `${frontendUrl}/auth/callback?token=${accessToken}&refreshToken=${refreshToken}&isNewUser=${isNewUser}`;
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Google OAuth 콜백 오류:", error);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendUrl}/login?error=oauth_error`);
    }
  })(req, res, next);
}
