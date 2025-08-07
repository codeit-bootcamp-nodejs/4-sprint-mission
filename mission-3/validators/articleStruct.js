import {size, string, object, partial} from 'superstruct';

export const createArticle = object({
    title: size(string(), 1, 50),
    content: size(string(), 1, 1000),
})

export const patchArticle = partial(createArticle);
