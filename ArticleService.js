/**
 *   파일명 : ArticleService.js
 *   등록일 : 2025.07.22
 *   등록자 : 변재윤
 *   수정내역 : 버전 올림  v1.0
 * */
import axios from 'axios';

/**
 * getArticleList
 * @param {*} page 
 * @param {*} pageSize 
 * @param {*} keyword 
 * @returns 
 */
export async function getArticleList(page = 1, pageSize = 5, keyword = ""){
  console.log('====> (API) getArticleList..');
  const url = new URL('https://panda-market-api-crud.vercel.app/articles');
  url.searchParams.append("page", page);
  url.searchParams.append("pageSize", pageSize);
  if(typeof keyword === "string" && keyword.trim()){
    url.searchParams.append("keyword", keyword.trim());
  }
  const res = await fetch(url);
  return res.json();
};

/**
 * getArticle
 * @param {*} id 
 * @returns 
 */
export async function getArticle(id){
  console.log('====> (API) getArticle..');
  const url = new URL(`https://panda-market-api-crud.vercel.app/articles/${id}`);
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

/**
 * createArticle
 * @param {*} articleData
 * @returns 
 */
export async function createArticle(articleData){
  console.log('====> (API) createArticle..');
  const res = await axios.post('https://panda-market-api-crud.vercel.app/articles', articleData);
  return res.data;
};

/**
 * patchArticle
 * @param {*} articleData, id 
 * @returns 
 */
export async function patchArticle(articleData, id){
  console.log('====> (API) patchArticle..');
  const res = await axios.patch(`https://panda-market-api-crud.vercel.app/articles/${id}`, articleData);
  return res.data;
};

/**
 * deleteArticle
 * @param {*} id 
 * @returns 
 */
export async function deleteArticle(id){
  console.log('====> (API) deleteArticle..');
  const res = await axios.delete(`https://panda-market-api-crud.vercel.app/articles/${id}`);
  return res.data;
};


