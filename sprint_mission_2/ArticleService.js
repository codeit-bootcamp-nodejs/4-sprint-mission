// ArticleService.js
import axios from 'axios';

const BASE_URL = 'https://panda-market-api-crud.vercel.app/articles';

export function getArticleList(page = 1, pageSize = 10, keyword = '') {
  return axios
    .get(BASE_URL, { params: { page, pageSize, keyword } })
    .then((res) => res.data.list || res.data)
    .catch((err) => console.error('failure on getArticleList:', err.message));
}

export function getArticle(articleId) {
  return axios
    .get(`${BASE_URL}/${articleId}`)
    .then((res) => res.data)
    .catch((err) => console.error('failure on getArticle:', err.message));
}

export function createArticle({ title, content, image }) {
  return axios
    .post(BASE_URL, { title, content, image })
    .then((res) => res.data)
    .catch((err) => console.error('failure on createArticle:', err.message));
}

export function patchArticle(articleId, { image, content, title }) {
  return axios
    .patch(`${BASE_URL}/${articleId}`, { image, content, title })
    .then((res) => res.data)
    .catch((err) => console.error('failure on patchArticle :', err.message));
}

export function deleteArticle(articleId) {
  return axios
    .delete(`${BASE_URL}/${articleId}`)
    .then((res) => res.data)
    .catch((err) => console.error('failure deleteArticle:', err.message));
}
