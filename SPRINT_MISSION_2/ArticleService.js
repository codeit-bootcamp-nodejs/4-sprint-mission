const BASE_URL = 'https://panda-market-api-crud.vercel.app';

export function getArticleList(page = 1, pageSize = 10, keyword = '') {
  return fetch(`${BASE_URL}/articles?page=${page}&pageSize=${pageSize}&keyword=${keyword}`)
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .catch(err => console.error('Error fetching article list:', err));
}

export function getArticle(articleId) {
  return fetch(`${BASE_URL}/articles/${articleId}`)
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .catch(err => console.error('Error fetching article:', err));
}

export function createArticle(title, article, image) {
  return fetch(`${BASE_URL}/articles`, {
    method: 'POST',
    headers: { 'article-Type': 'application/json' },
    body: JSON.stringify({ title, article, image })
  })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .catch(err => console.error('Error creating article:', err));
}

export function patchArticle(articleId, title, article, image) {
  return fetch(`${BASE_URL}/articles/${articleId}`, {
    method: 'PATCH',
    headers: { 'article-Type': 'application/json' },
    body: JSON.stringify({ title, article, image })
  })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .catch(err => console.error('Error patching article:', err));
}

export function deleteArticle(articleId) {
  return fetch(`${BASE_URL}/articles/${articleId}`, {
    method: 'DELETE' })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .catch(err => console.error('Error deleting article:', err));
}