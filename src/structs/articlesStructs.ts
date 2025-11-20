import { object, string, optional } from 'superstruct';

export const CreateArticleBodyStruct = object({
  title: string(),
  content: string(),
  image: optional(string()),
});

export const UpdateArticleBodyStruct = object({
  title: optional(string()),
  content: optional(string()),
  image: optional(string()),
});
