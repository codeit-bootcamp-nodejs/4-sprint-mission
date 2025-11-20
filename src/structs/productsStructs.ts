import { object, string, number, array, optional } from 'superstruct';

export const CreateProductBodyStruct = object({
  name: string(),
  description: string(),
  price: number(),
  tags: array(string()),
  images: array(string()),
});

export const UpdateProductBodyStruct = object({
  name: optional(string()),
  description: optional(string()),
  price: optional(number()),
  tags: optional(array(string())),
  images: optional(array(string())),
});
