import type { Controller } from "../controller.js";
import type {
  RegisterBodyDto,
  LoginBodyDto,
} from "../../dto/request/auth.request.dto.js";

export type RegisterController = Controller<unknown, unknown, RegisterBodyDto>;

export type LoginController = Controller<unknown, unknown, LoginBodyDto>;
