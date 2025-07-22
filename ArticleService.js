// 게시글(Article)을 나타내는 클래스
export class Article {
  // 생성자: 게시글 정보를 받아서 속성 초기화
  constructor({ title, content, writer, likeCount = 0, createdAt = null }) {
    this.title = title; // 게시글 제목 저장
    this.content = content; // 게시글 내용 저장
    this.writer = writer; // 작성자 정보 저장
    this.likeCount = likeCount; // 좋아요 수, 기본값 0
    // 생성일자: 값이 들어오면 사용, 아니면 현재 시각(ISO 문자열)로 초기화
    this.createdAt = createdAt || new Date().toISOString();
  }
  // like 메서드: 좋아요 수를 1 증가시킴
  like() {
    this.likeCount += 1;
  }
}

const BASE_URL = 'https://panda-market-api-crud.vercel.app/api/articles';

// GET - Article 리스트 (page, pageSize, keyword)
export function getArticleList({ page = 1, pageSize = 10, keyword = '' } = {}) {
  // 요청 URL을 page, pageSize, keyword 파라미터로 조합
  const url = `${BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`;
  // fetch로 비동기 GET 요청, then/catch로 결과 처리
  return (
    fetch(url)
      .then((res) => {
        // 응답 코드가 2xx 아니면 에러 발생
        if (!res.ok) throw new Error(`게시글 리스트 조회 실패: ${res.status}`);
        // 응답 본문을 JSON으로 변환
        return res.json();
      })
      // JSON에서 articles 배열만 꺼내 반환
      .then((data) => data.articles)
      // 에러 발생 시 메시지 출력 후 빈 배열 반환
      .catch((e) => {
        console.error(e.message);
        return [];
      })
  );
}

// 특정 게시글 1개를 불러오는 함수 (GET 요청)
export function getArticle(id) {
  // 게시글 id로 GET 요청
  return fetch(`${BASE_URL}/${id}`)
    .then((res) => {
      // 응답이 성공(2xx)이 아니면 에러 발생
      if (!res.ok) throw new Error(`게시글 조회 실패: ${res.status}`);
      // 성공하면, 응답 데이터를 JSON으로 변환
      return res.json();
    })
    .catch((e) => {
      // 에러 발생 시 메시지 콘솔에 출력
      console.error(e.message);
      // 실패 시 null 반환 (실패 신호)
      return null;
    });
}

// 게시글을 새로 생성(등록)하는 함수 (POST 요청)
export function createArticle({ title, content, image }) {
  // BASE_URL로 POST 요청, 게시글 데이터 전달
  return fetch(BASE_URL, {
    method: 'POST', // HTTP 메서드: POST(생성)
    headers: { 'Content-Type': 'application/json' }, // 요청 본문 타입: JSON
    body: JSON.stringify({ title, content, image }), // 게시글 데이터를 JSON 문자열로 변환해 전송
  })
    .then((res) => {
      // 응답 코드가 2xx(성공)가 아니면 에러 발생
      if (!res.ok) throw new Error(`게시글 생성 실패: ${res.status}`);
      // 성공 시 응답 데이터를 JSON으로 반환
      return res.json();
    })
    .catch((e) => {
      // 에러 발생 시 콘솔에 에러 메시지 출력
      console.error(e.message);
      // 실패 시 null 반환
      return null;
    });
}

// 특정 게시글을 수정하는 함수 (PATCH 요청)
export function patchArticle(id, data) {
  // 게시글 id로 PATCH 요청, 수정 데이터 전달
  return fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH', // HTTP 메서드: PATCH(부분 수정)
    headers: { 'Content-Type': 'application/json' }, // 요청 본문 타입: JSON
    body: JSON.stringify(data), // 수정할 데이터를 JSON 문자열로 변환해서 보냄
  })
    .then((res) => {
      // 응답 코드가 2xx(성공)가 아니면 에러 발생
      if (!res.ok) throw new Error(`게시글 수정 실패: ${res.status}`);
      // 성공 시 응답 데이터를 JSON으로 반환
      return res.json();
    })
    .catch((e) => {
      // 에러 발생 시 콘솔에 에러 메시지 출력
      console.error(e.message);
      // 실패 시 null 반환
      return null;
    });
}

// 특정 게시글을 삭제하는 함수 (DELETE 요청)
export function deleteArticle(id) {
  // 게시글 id로 DELETE 요청(삭제)
  return fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
    .then((res) => {
      // 응답 코드가 2xx(성공)가 아니면 에러 발생
      if (!res.ok) throw new Error(`게시글 삭제 실패: ${res.status}`);
      // 성공 시 true 반환(삭제 성공 신호)

      return true;
    })
    .catch((e) => {
      // 에러 발생 시 메시지 콘솔에 출력
      console.error(e.message);
      // 실패 시 false 반환(삭제 실패 신호)
      return false;
    });
}
