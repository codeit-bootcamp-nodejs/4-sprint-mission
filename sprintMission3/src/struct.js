import *as s from 'superstruct'

export const CreateProduct = s.object({
 id: s.integer(),
 name: s.size(s.string(), 1, 10),
 description : s.min(s.string(), 0),
 price: s.min(s.number(),0),
});

export const PatchProduct = s.partial(CreateProduct);

export const CreateArticle = s.object({
 id: s.integer(),
 title: s.min(s.string(), 1), 
 content: s.min(s.string(), 10),
});

export const PatchArticle = s.partial(CreateArticle);

export const CreateComment = s.object({
 id: s.integer(),
 title: s.min(s.string(), 1), 
 content: s.min(s.string(), 10),
});

export const PatchComment = s.partial(CreateComment);

