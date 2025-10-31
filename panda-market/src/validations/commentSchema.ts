import * as z from 'zod';

// prettier-ignore
export const postSchema = z.object({
  content: z.string().min(1, "내용을 입력해주세요"),
}).strict();

export const getCommentListSchema = z
  .object({
    cursorId: z.preprocess((val) => {
      // 값이 존재하지만 비어있거나( '' ), null, undefined일 경우 undefined로 통일
      if (!val || String(val).trim() === '') return undefined;
      return Number(val);
    }, z.number().int().positive('cursorId는 양수여야 합니다.').optional()),
    page: z.coerce.number().int().catch(0),
    pageSize: z.coerce.number().int().catch(10),
  })
  .transform((data) => {
    // 만약 cursorId가 undefined라면,
    if (data.cursorId === undefined) {
      // cursorId를 제외한 나머지 속성만 가진 새로운 객체를 반환
      const { cursorId: _cursorId, ...rest } = data;
      return rest;
    }
    return data;
  });
