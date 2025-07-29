import axios from 'axios';
const baseUrl = 'https://panda-market-api-crud.vercel.app/articles';

// 페이지 목록을 불러오는 함수
export async function getArticleList({ page= 1, pageSize= 10, keyword= ''}={}) {
  
  return axios.get(baseUrl, {
	params: { page, pageSize, keyword }	
  })
  .then(res => { 
    console.log(res.data);
    return res.data;
  })
  .catch(e => {
    console.error(`getArticleList failed: ${e.response?.status || 'No status'} ${e.response?.statusText || e.message}`);
    return [];
  })
}

export async function getArticle(id) {
  
  return axios.get(`${baseUrl}/${id}`)
  .then(res => { 
    console.log(res.data);
    return res.data;
  })
  .catch(e => {
    console.error(`getArticle failed: ${e.response?.status || 'No status'} ${e.response?.statusText || e.message}`);
    return null;
  })
}

export async function createArticle(title, content, image) {
  
  return axios.post(baseUrl, { title, content, image })
  .then(res => { 
    console.log(res.data);
    return res.data;
  })
  .catch(e => {
    console.error(`createArticle failed: ${e.response?.status || 'No status'} ${e.response?.statusText || e.message}`);
    return [];
  })
}

export async function patchArticle(id, updatevalue) {
  
  return axios.patch(`${baseUrl}/${id}`, updatevalue
  )
  .then(res => { 
    console.log(res.data);
    return res.data;
  })
  .catch(e => {
    console.error(`patchArticle failed: ${e.response?.status || 'No status'} ${e.response?.statusText || e.message}`);
    return [];
  })
}

export async function deleteArticle(id) {
  
  return axios.delete(`${baseUrl}/${id}`)
  .then(res => { 
    console.log(res.data);
    return res.data;
  })
  .catch(e => {
    console.error(`deleteArticle failed: ${e.response?.status || 'No status'} ${e.response?.statusText || e.message}`);
    return [];
  })
}