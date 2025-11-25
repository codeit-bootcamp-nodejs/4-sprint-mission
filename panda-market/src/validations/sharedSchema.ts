import * as z from 'zod';

// prettier-ignore
export const idSchema = z.object({
  id: z.coerce.number().int({ message: "ID는 정수여야 합니다." }),
}).strict();

// 목록 검색을 위한 유효성 검사 및 기본값 설정
// page, nums는 사용자가 이상한 값을 입력하거나 int로 변환 불가능한 값을 주거나 아에 쿼리 자체를 설정하지 않은 경우
// 기본값을 설정해 목록을 조회할 수 있도록 함

// prettier-ignore
export const getListSchema = z.object({
  keyword: z.string().optional().default(''),
  page: z.coerce.number().int({ message: "page는 정수여야 합니다." }).positive().catch(1),
  pageSize: z.coerce.number().int({ message: "pageSize는 정수여야 합니다." }).positive().catch(10),
  orderBy: z.string().optional().default('recent'),
}).strict();
