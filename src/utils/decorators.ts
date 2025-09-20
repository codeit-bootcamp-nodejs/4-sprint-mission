import {
  IsString,
  Length,
  IsNotEmpty,
  IsDefined,
  IsInt,
  IsArray,
} from "class-validator";

export function RequiredString(fieldName: string, min: number, max: number) {
  const isDefined = IsDefined({ message: `${fieldName}은 필수입니다.` });
  const isNotEmpty = IsNotEmpty({
    message: `${fieldName}은 비어 있을 수 없습니다.`,
  });
  const isString = IsString({ message: `${fieldName}은 문자열이어야 합니다.` });
  const length = Length(min, max, {
    message: `${fieldName}은 ${min}~${max}자 사이여야 합니다.`,
  });

  return function (target: any, propertyKey: string) {
    isDefined(target, propertyKey);
    isNotEmpty(target, propertyKey);
    isString(target, propertyKey);
    length(target, propertyKey);
  };
}

export function RequiredInt(fieldName: string) {
  const isDefined = IsDefined({ message: `${fieldName}은 필수입니다.` });
  const isNotEmpty = IsNotEmpty({
    message: `${fieldName}은 비어 있을 수 없습니다.`,
  });
  const isInt = IsInt({ message: `${fieldName}은 정수여야 합니다.` });

  return function (target: any, propertyKey: string) {
    isDefined(target, propertyKey);
    isNotEmpty(target, propertyKey);
    isInt(target, propertyKey);
  };
}

export function RequiredArray(fieldName: string) {
  const isDefined = IsDefined({ message: `${fieldName}은 필수입니다.` });
  const isNotEmpty = IsNotEmpty({
    message: `${fieldName}은 비어 있을 수 없습니다.`,
  });
  const isArray = IsArray({ message: `${fieldName}은 배열이어야 합니다.` });
  return function (target: any, propertyKey: string) {
    isDefined(target, propertyKey);
    isNotEmpty(target, propertyKey);
    isArray(target, propertyKey);
  };
}
