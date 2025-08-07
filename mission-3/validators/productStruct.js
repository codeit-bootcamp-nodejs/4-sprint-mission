import {object, string, size, partial, array, integer} from 'superstruct';

export const createProduct = object({
    name: size(string(), 1, 50),
    description: size(string(), 1, 500),
    price: integer(),
    tags: array(string()),
})

export const patchProduct = partial(createProduct);



