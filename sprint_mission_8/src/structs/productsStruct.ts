import { coerce, partial, object, string, min, nonempty, array, integer } from 'superstruct';
import { PageParamsStruct } from './commonStructs';

export const CreateProductBodyStruct = object({
  name: coerce(nonempty(string()), string(), (value) => value.trim()),
  description: nonempty(string()),
  price: min(integer(), 0),
  tags: array(nonempty(string())),
  images: array(nonempty(string())),
});

export const GetProductListParamsStruct = PageParamsStruct;

export const UpdateProductBodyStruct = partial(CreateProductBodyStruct);
