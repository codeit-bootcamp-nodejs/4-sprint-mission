import { object, string } from 'superstruct';

export const SignUpBodyStruct = object({
  email: string(),
  nickname: string(),
  password: string(),
});

export const SignInBodyStruct = object({
  email: string(),
  password: string(),
});
