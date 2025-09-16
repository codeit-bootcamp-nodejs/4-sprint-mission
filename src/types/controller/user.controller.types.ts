import type { Controller } from "../controller.js";
import type {
  UpdateProfileBodyDto,
  ChangePasswordBodyDto,
} from "../../dto/request/user.request.dto.js";

export type UpdateProfileController = Controller<
  unknown,
  unknown,
  UpdateProfileBodyDto
>;

export type ChangePasswordController = Controller<
  unknown,
  unknown,
  ChangePasswordBodyDto
>;
