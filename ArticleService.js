export class Article {
  constructor(title, content, writer, likeCount = 0) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = likeCount;
    this.createdAt = new Date().toISOString();
  }

  like() {
    this.likeCount += 1;
  }
}

const API_URL = 'https://panda-market-api-crud.vercel.app/articles';

export function getArticleList(page = 1, pageSize = 10, keyword = '') {
  return fetch(`${API_URL}?page=${page}&pageSize=${pageSize}&keyword=${keyword}`)
    .then((res) => {
      if (!res.ok) throw new Error('글 목록 조회 실패');
      return res.json();
    })
    .catch((e) => console.error(e.message));
}

export function getArticle(id) {
  return fetch(`${API_URL}/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error('글 조회 실패');
      return res.json();
    })
    .catch((e) => console.error(e.message));
}

// ✅ 중복 제거된 createArticle 함수
export function createArticle(article) {
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article),
  })
    .then((res) => {
      if (!res.ok) {
        console.error('API 응답 상태 코드:', res.status);
        throw new Error('글 생성 실패');
      }
      return res.json();
    })
    .catch((e) => {
      console.error('에러 메시지:', e.message);
    });
}

export function deleteArticle(id) {
  return fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
    .then((res) => {
      if (!res.ok) throw new Error('글 삭제 실패');
      return res.json();
    })
    .catch((e) => console.error(e.message));
}
