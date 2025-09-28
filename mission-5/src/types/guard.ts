import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import type { Content, ParentContentType } from './shared.type.js';
import { UnauthorizedError } from '@/lib/errors.js';

export function hasTokenPayload(
  req: Request
): req is Request & { tokenPayload: JwtPayload & { userId: number } } {
  // 이 결과가 true가 되면 req객체에 tokenPayload가 반드시 있다는 증명
  return (
    typeof req.tokenPayload === 'object' && // 1. 타입이 'object'이고
    req.tokenPayload !== null && // 2. null이 아니며
    'userId' in req.tokenPayload // 3. 내부에 'id' 속성이 있는지 확인
  );
}

export function hasContent(
  req: Request
): req is Request & { tokenPayload: JwtPayload; content: Content } {
  return hasTokenPayload(req) && typeof req.content === 'string';
}

export function hasId(req: Request): req is Request & { parsedId: { id: number } } {
  return (
    typeof req.parsedId === 'object' && // 1. parsedId가 객체이고
    req.parsedId !== null && // 2. null이 아니며
    'id' in req.parsedId && // 3. 내부에 'id' 속성이 있고
    typeof req.parsedId.id === 'number' // 4. 그 id의 타입이 숫자인지 확인)
  );
}

export function hasIdAndUserId(
  req: Request
): req is Request & { parsedId: { id: number }; tokenPayload: JwtPayload } {
  return hasTokenPayload(req) && hasId(req);
}

export function hasParsedQuery(
  req: Request
): req is Request & { parsedQuery: { keyword: string; page: number; pageSize: number } } {
  return (
    typeof req.parsedQuery === 'object' &&
    req.parsedQuery !== null &&
    'keyword' in req.parsedQuery &&
    'page' in req.parsedQuery &&
    'pageSize' in req.parsedQuery
  );
}

export function hasCursorQuery(
  req: Request
): req is Request & { parsedCursorQuery: { page: number; pageSize: number } } {
  return (
    typeof req.parsedCursorQuery === 'object' &&
    req.parsedCursorQuery !== null &&
    'page' in req.parsedCursorQuery &&
    'pageSize' in req.parsedCursorQuery
  );
}

export function hasFile(req: Request): req is Request & { file: File } {
  return (
    typeof req.file === 'object' &&
    req.file !== null &&
    'path' in req.file && // file 객체 안에 path가 있는지 확인
    typeof req.file.path === 'string'
  );
}

export function hasParent(req: Request): req is Request & { parentType: 'products' | 'articles' } {
  const validParentTypes: ParentContentType[] = ['products', 'articles'];
  return (
    typeof req.parentType === 'string' &&
    // req.parentType이 유효한 값 중 하나인지 런타임에 확인합니다.
    (validParentTypes as string[]).includes(req.parentType)
  );
}

export function hasParentId(req: Request): req is Request & { parentId: number } {
  return typeof req.parentId === 'number';
}

export function isValidBearerToken(authHeader: string | undefined): authHeader is string {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('유효한 인증 헤더가 필요합니다.');
  }

  // 2. 헤더에서 토큰 부분만 추출
  const token = authHeader.split(' ')[1];

  // 3. 추출된 토큰이 없으면 에러
  if (!token) {
    throw new UnauthorizedError('토큰이 존재하지 않습니다.');
  }

  // 4. 모든 검증을 통과하면 순수한 토큰을 반환
  return true;
}
