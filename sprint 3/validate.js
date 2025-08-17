// 리퀘스트 유효성 검사하기

import { z } from 'zod' 

/***********product 검사*************/

// post 리퀘스트 바디 검사 및 예상하는 데이터 형식 정의
const CreateProduct = z.object({
  name: z.string().min(1, { message: "최소 1자 이상이어야 합니다." }).max(50, {  message: " 최대 50자 이하이어야 합니다."}),
  description: z.string().min(1,  { message: "최소 1자 이상이어야 합니다." }),
  price: z.number().min(0),
  tags: z.array(z.string()),
  imageUrl: z.string().optional() // 이미지 경로 필드는 선택 사항
})

// patch 리퀘스트 바디 검사 및 예상하는 데이터 형식
// partial 함수 사용
const PatchProduct = CreateProduct.partial() // CreateProduct의 유효성 검사의 전체가 아닌 일부면 괜찮다는 의미




/*********** Article 검사*************/

// POST 요청 바디 유효성 검사
const createArticle = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
  imageUrl: z.string().optional() // 이미지 경로 필드는 선택 사항
});

// 수정: title과 content는 선택적 문자열
const patchArticle = z.object({
  title: z.string().min(1, "제목을 입력해주세요.").optional(),
  content: z.string().min(1, "내용을 입력해주세요.").optional(),
  imageUrl: z.string().optional()
}).refine(data => data.title !== undefined || data.content !== undefined, {
    message: "제목 또는 내용 중 하나는 수정되어야 합니다."
});



/***********comment 검사*************/
const createComment = z.object({
  content: z.string().min(1, "내용을 입력해 주세요.")
})