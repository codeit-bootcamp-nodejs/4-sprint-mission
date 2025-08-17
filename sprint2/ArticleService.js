import axios from 'axios';

const URL = 'https://panda-market-api-crud.vercel.app/articles/';

export async function getArticleList({page, pageSize, keyword}) {
  return fetch(URL,{
      params: {page, pageSize, keyword}
    })
  .then(res => res.json())
  .then(data => {
    return data
  })
  .catch((e) => {
    if(!res.ok) {
    console.log('목록을 가져오는 중 오류가 발생했습니다.');
  }
});
}

export async function getArticle(articleId) {
  const res = await axios.get(`${URL}${articleId}`)
  .catch((e) => {
    console.log('오류가 발생했습니다.');
    return null;
  });
  return res?.data || null;
}

export async function createArticle({title, content, image}) {
  const res = await axios.post(
  `${URL}`, 
  {title, content, image}
  )
  .catch((e) => {
    console.log('오류가 발생했습니다.');
    return null;
  });
  return res?.data || null;
}

export async function patchArticle(articleId,{title, content, image}) {
  const res = await axios.patch(
  `${URL}/${articleId}`, 
  {title, content, image},
  )
  .catch((e) => {
    console.log('오류가 발생했습니다.');
    return null;
  });
  return res?.data || null;
}

export async function deleteArticle(articleId) {
  const res = await axios.delete(`${URL}${articleId}`)
  .catch((e) => {
    console.log('오류가 발생했습니다.');
    return null;
  });
  return res?.data || null;
}