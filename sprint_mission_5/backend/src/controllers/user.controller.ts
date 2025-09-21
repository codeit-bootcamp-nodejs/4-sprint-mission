import { Request, Response, NextFunction } from 'express';
import { serviceContainer } from '../services/service.container.js';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../dto/index.js';
import { AuthRequest } from '../types/auth.js';

interface AuthRequestExtended extends Request, AuthRequest {}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, nickname, password, image }: CreateUserDto = req.body;

    if (!email || !nickname || !password) {
      res
        .status(400)
        .json({ message: '이메일, 닉네임, 비밀번호를 모두 입력해주세요.' });
      return;
    }

    const userService = serviceContainer.getUserService();
    const result = await userService.register({
      email,
      nickname,
      password,
      ...(image && { image }),
    });

    res.status(201).json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === '이미 존재하는 이메일입니다.'
    ) {
      res.status(409).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password }: LoginUserDto = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ message: '이메일과 비밀번호를 모두 입력해주세요.' });
      return;
    }

    const userService = serviceContainer.getUserService();
    const result = await userService.login({ email, password });

    res.status(200).json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === '존재하지 않는 이메일입니다.' ||
        error.message === '비밀번호가 일치하지 않습니다.')
    ) {
      res.status(401).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

export const logout = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const userService = serviceContainer.getUserService();
    await userService.logout(req.user.id);

    res.status(200).json({ message: '로그아웃되었습니다.' });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const userService = serviceContainer.getUserService();
    const user = await userService.getUserById(req.user.id);

    if (!user) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const updateData: UpdateUserDto = req.body;
    const userService = serviceContainer.getUserService();
    const updatedUser = await userService.updateUser(req.user.id, updateData);

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: '리프레시 토큰이 필요합니다.' });
      return;
    }

    const userService = serviceContainer.getUserService();
    const result = await userService.refreshAccessToken(refreshToken);

    res.status(200).json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === '유효하지 않은 리프레시 토큰입니다.'
    ) {
      res.status(401).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

export const changePassword = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    res.status(501).json({ message: '비밀번호 변경 기능은 아직 구현되지 않았습니다.' });
  } catch (error) {
    next(error);
  }
};

export const getMyProducts = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const userService = serviceContainer.getUserService();
    const result = await userService.getMyProducts(req.user.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyLikedProducts = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const userService = serviceContainer.getUserService();
    const result = await userService.getMyLikedProducts(req.user.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyArticles = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const userService = serviceContainer.getUserService();
    const result = await userService.getMyArticles(req.user.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
