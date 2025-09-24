import { makeValidator } from "../lib/validator.js";
import { QueryGuardSchema } from "../schemas/queryGuardSchemas.js";

export const queryGuard = makeValidator({ query: QueryGuardSchema });
