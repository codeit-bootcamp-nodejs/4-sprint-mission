import { nonempty, nullable, object, string } from 'superstruct';

export const RegisterBodyStruct = object({
  email: nonempty(string()),
  nickname: nonempty(string()),
  password: nonempty(string()),
  image: nullable(string()),
});

export const LoginBodyStruct = object({
  email: nonempty(string()),
  password: nonempty(string()),
});

