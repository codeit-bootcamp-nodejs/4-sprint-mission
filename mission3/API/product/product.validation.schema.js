import { z } from "zod";

//frame
export const productParamsSchema = z.object({
  // tracking the transformed character(coerce) is not integer and not negative
  id: z.coerce
    .number({ invalid_type_error: "id must be integer" })
    .int()
    .positive({ message: "Not allow to put negative Natural Number" }),
});

export const productQuerySchema = z.object({
  // pagination
  page: z.coerce
    .number({ invalid_type_error: "page must be number" })
    .int({ message: "page must be an integer" })
    .min(1, { message: "the page must be bigger than 1" })
    .max(100, { message: "the number of pages must not be bigger then 100" })
    .default(1),

  skip: z.coerce
    .number({ invalid_type_error: "the skip number must be number " })
    .int({ message: "page must be an integer" })
    .min(0, { message: "" })
    .default(0), // skip < 0 ?

  take: z.coerce
    .number({ invalid_type_erro: "the take number must be integerx" })
    .int({ message: "take number must be integer" })
    .min(0, { message: "skip must be 0 or more" })
    .default(10), // 1 - 10
});

export const productBodySchema = z.object({
  name: z
    .string()
    .min(1, { message: "the number of character should be more than 1" }),
  description: z.string().min(1, {
    message: "the number of character should be more than 1 in description",
  }),
  price: z.int().nonnegative(), //
  tags: z.array(z.string()).min(1),
});

export const productPatchSchema = z.object({
  name: z
    .string()
    .min(1, { message: "the number of character should be more than 1" }),
  description: z.string().min(1, {
    message: "the number of character should be more than 1 in description",
  }),
  price: z.int().nonnegative(),
  tags: z.array(z.string()).min(1),
});
