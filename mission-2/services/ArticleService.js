import axios from 'axios';
import { ARTICLE_BASE_URL as BASE_URL } from '../constants/api.js'; // 변경

// 게시글 리스트 조회 (.then 사용)
export function getArticleList(page = 1, pageSize = 10, keyword = '') {
  return axios
    .get(BASE_URL, {
      params: { page, pageSize, keyword },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error('getArticleList 오류:', err.message);
    });
}

// 게시글 단건 조회
export function getArticle(id) {
  return axios
    .get(`${BASE_URL}/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error('getArticle 오류:', err.message);
    });
}

// 게시글 생성
export function createArticle(articleData) {
  return axios
    .post(BASE_URL, articleData)
    .then((res) => res.data)
    .catch((err) => {
      console.error('createArticle 오류:', err.message);
    });
}

// 게시글 수정
export function patchArticle(id, articleData) {
  return axios
    .patch(`${BASE_URL}/${id}`, articleData)
    .then((res) => res.data)
    .catch((err) => {
      console.error('patchArticle 오류:', err.message);
    });
}

// 게시글 삭제
export function deleteArticle(id) {
  return axios
    .delete(`${BASE_URL}/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error('deleteArticle 오류:', err.message);
    });
}
