// services/ArticleService.js
import axiosInstance from '../api/axiosInstance.js';

export async function getArticleList({ page = 1, pageSize = 10, keyword = '' }) {
  try {
    const res = await axiosInstance.get('/articles', {
      params: { page, pageSize, keyword }
    });
    return res.data;
  } catch (err) {
    console.error('게시글 목록 요청 실패:', err.response?.data || err.message);
  }
}

export async function getArticle(articleId) {
  try {
    const res = await axiosInstance.get(`/articles/${articleId}`);
    return res.data;
  } catch (err) {
    console.error('게시글 요청 실패:', err.response?.data || err.message);
  }
}

export async function createArticle({ title, content, image }) {
  try {
    const res = await axiosInstance.post('/articles', { title, content, image });
    return res.data;
  } catch (err) {
    console.error('게시글 생성 실패:', err.response?.data || err.message);
  }
}

export async function patchArticle(articleId, { title, content, image }) {
  try {
    const res = await axiosInstance.patch(`/articles/${articleId}`, {
      title,
      content,
      image
    });
    return res.data;
  } catch (err) {
    console.error('게시글 수정 실패:', err.response?.data || err.message);
  }
}

export async function deleteArticle(articleId) {
  try {
    const res = await axiosInstance.delete(`/articles/${articleId}`);
    return res.data;
  } catch (err) {
    console.error('게시글 삭제 실패:', err.response?.data || err.message);
  }
}
