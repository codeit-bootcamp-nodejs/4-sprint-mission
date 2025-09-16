import type { Controller } from "../controller.js";
import type { QueryGuardDto } from "../../dto/request/queryGuard.request.dto.js";

export type QueryGuard = Controller<unknown, unknown, unknown, QueryGuardDto>;
