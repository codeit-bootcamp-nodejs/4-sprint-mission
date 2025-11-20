import { coerce, integer, object, string } from 'superstruct';

const integerString = coerce(integer(), string(), (value) => parseInt(value));

export const IdParamsStruct = object({
  id: integerString,
});
