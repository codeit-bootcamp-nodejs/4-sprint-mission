import {object, string, size, partial, array, integer} from 'superstruct';

export const createValidator = object({
    name: size(string(), 1, 50),
    description: size(string(), 1, 500),
    price: integer(),
    tags: array(string()),
})

export const patchValidator = partial(createValidator);



