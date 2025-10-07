import { z } from "zod";

const TYPE_ERROR_MESSAGE = "Type must be one of the allowed values";
const ALLOWED_TYPES = ["MARKET", "ARTICLE"];

export const commentQuerySchema = z.object({
  page: z.coerce
    .number({ message: "it must number" })
    .int()
    .positive({ message: "the integer must be positive integer" })
    .default(1),

  skip: z.coerce
    .number({ message: "it must number" })
    .int()
    .positive({ message: "the integer must be positive integer" })
    .default(0),

  take: z.coerce
    .number({ message: "it must number" })
    .int()
    .positive({ message: "the integer must be positive integer" })
    .default(10),

  type: z
    .string({ message: "Type is required" })
    .transform((val) => val.toUpperCase(val))
    .refine((val) => ALLOWED_TYPES.includes(val), {
      message: TYPE_ERROR_MESSAGE,
    }),
});

export const commentParamsSchema = z.object({
  id: z.coerce
    .number({ message: "the index must be number" })
    .int()
    .min(0, { message: "the index should be greater or equal than 0" }),
});

export const commentBodySchema = z.object({
  title: z.string().nonempty({ message: "Invalid title" }),
  content: z.string().nonempty({ message: "Invalid content" }),
});
