import type { User } from "@prisma/client";
import type {
  CheckUserExistsDto,
  CreateUserDto,
} from "../../dto/service/auth.service.dto.js";

// 회원가입
export type CheckUserExistsInput = CheckUserExistsDto;
export type CheckUserExistsResult = User | null;

// 로그인
export type CreateUserInput = CreateUserDto;
export type CreateUserResult = User;
