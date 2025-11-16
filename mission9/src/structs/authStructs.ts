import { nonempty, object, string } from 'superstruct';

export const RegisterBodyStruct = object({
  email: nonempty(string()),
  nickname: nonempty(string()),
  password: nonempty(string()),
});

export const LoginBodyStruct = object({
  email: nonempty(string()),
  password: nonempty(string()),
});

