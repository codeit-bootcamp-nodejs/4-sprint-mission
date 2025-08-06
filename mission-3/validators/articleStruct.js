import * as s from 'superstruct';

export const createArticle = s.object({
    title: s.size(s.string(), 1, 50),
    content: s.size(s.string(), 1, 1000),
})

export const patchArticle = s.partial(createArticle);
