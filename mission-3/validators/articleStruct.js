import {size, string, object, partial} from 'superstruct';

export const createValidator = object({
    title: size(string(), 1, 50),
    content: size(string(), 1, 1000),
})

export const patchValidator = partial(createValidator);
