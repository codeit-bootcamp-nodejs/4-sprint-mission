export const errorHandler = (error, req, res, next) => {
  console.error(error); // 에러 로그 확인

  // prisma 관련 에러
  // 요청한 레코드가 없을 때 에러처리
  if (error.code === 'P2025') {
    return res.status(404).json({ error: '요청한 자원을 찾을 수 없습니다.' });
  }

  // 고유 제약 조건 실패 (이미 존재하는 이름으로 상품 생성 시도)
  if (error.code === 'P2002') {
    const field = error.meta.target[0];
    return res.status(409).json({ error: `${field} 필드가 이미 존재합니다.` });
  }

  // 추가적으로 필요한 에러 핸들러 작성 가능

  // 그외 모든 에러처리 (기본값 : 500 서버 에러)
  res
    .status(500)
    .json({ error: '서버 내부의 예상치 못한 오류가 발생했습니다.' });
};
