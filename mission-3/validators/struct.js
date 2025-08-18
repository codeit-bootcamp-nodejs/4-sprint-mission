import { coerce, object, integer, string, defaulted } from "superstruct"

export const idValidator = object({
    id: coerce(integer(), string(), val => /^\d+$/.test(val) ? parseInt(val) : val)
})

// 목록 검색을 위한 유효성 검사 및 기본값 설정
// keyword는 문자열이 아닌 값이 오거나 쿼리 자체를 설정하지 않은 경우 전체 검색이 되도록 빈 문자열 설정
// page, nums는 사용자가 이상한 값을 입력하거나 int로 변환 불가능한 값을 주거나 아에 쿼리 자체를 설정하지 않은 경우
// 기본값을 설정해 목록을 조회할 수 있도록 함, 정규표현식으로 float 값도 방지
// 결국 get으로 쿼리에 아무것도 안써도 전체 목록을 조회해서 반환함
export function validAndParsingInteger(data){ // 기본 값 설정
    return coerce(integer(), string(), (val) => /^\d+$/.test(val) ? parseInt(val) : parseInt(data))
} // coerce(출력타입, 입력타입, 변환함수)

export const getListValidator = object({
    keyword: defaulted(string(), ''),
    page: defaulted(validAndParsingInteger(0), 0),
    nums: defaulted(validAndParsingInteger(10), 10),
})

