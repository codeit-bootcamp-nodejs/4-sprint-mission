const BASE_URL = 'https://panda-market-api-crud.vercel.app';

export function getArticleList(page = 1, pageSize = 10, keyword = '') {
  const url = `${BASE_URL}/articles?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`;

  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`목록 불러오기 실패: ${res.status}`);
      }
      return res.json();
    })
    .catch((err) => {
      console.error('getArticleList error:', err.message);
    });
}

export function getArticle(articleId) {
  const url = `${BASE_URL}/articles/${articleId}`;

  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`게시글 조회 실패: ${res.status}`);
      }
      return res.json();
    })
    .catch((err) => {
      console.error('getArticle error:', err.message);
    });
}

export function createArticle({ title, content, image }) {
  const url = `${BASE_URL}/articles`;

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, content, image })
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`게시글 생성 실패: ${res.status}`);
      }
      return res.json();
    })
    .catch((err) => {
      console.error('createArticle error:', err.message);
    });
}

export function patchArticle(articleId, { title, content, image }) {
  const url = `${BASE_URL}/articles/${articleId}`;

  return fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, content, image })
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`게시글 수정 실패: ${res.status}`);
      }
      return res.json();
    })
    .catch((err) => {
      console.error('patchArticle error:', err.message);
    });
}

export function deleteArticle(articleId) {
  const url = `${BASE_URL}/articles/${articleId}`;

  return fetch(url, {
    method: 'DELETE'
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`게시글 삭제 실패: ${res.status}`);
      }
      return res.json();
    })
    .catch((err) => {
      console.error('deleteArticle error:', err.message);
    });
}
