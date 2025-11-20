import { coerce, integer, object, string, optional, defaulted } from 'superstruct';

const integerString = coerce(integer(), string(), (value) => parseInt(value));

export const UpdateMeBodyStruct = object({
  nickname: optional(string()),
  image: optional(string()),
});

export const UpdatePasswordBodyStruct = object({
  password: string(),
  newPassword: string(),
});

export const GetMyProductListParamsStruct = object({
  page: defaulted(integerString, 1),
  pageSize: defaulted(integerString, 10),
  orderBy: defaulted(string(), 'recent'),
  keyword: optional(string()),
});

export const GetMyFavoriteListParamsStruct = GetMyProductListParamsStruct;

export const GetMyNotificationsParamsStruct = object({
  cursor: optional(integerString),
  limit: defaulted(integerString, 10),
});
