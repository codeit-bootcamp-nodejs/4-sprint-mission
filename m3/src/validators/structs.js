import * as s from 'superstruct';

export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 30),
  description: s.size(s.string(), 1, 100),
  price: s.min(s.integer(), 0),
  tags: s.size(s.array(s.size(s.string(), 1, 10)), 0, 5),
});

export const PatchProduct = s.partial(CreateProduct);

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 30),
  content: s.size(s.string(), 1, 100),
});

export const PatchArticle = s.partial(CreateArticle);

export const CreateComment = s.object({
  content: s.size(s.string(), 1, 500),
});

export const PatchComment = s.partial(CreateComment);
