export async function getArticleList(params) {
    const url = new URL(`https://panda-market-api-crud.vercel.app/articles`);
    Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
    );

    const res = await fetch(url);
    const data = await res.json();
    return data;
}

export async function getArticle() {
    const res = await fetch (`https://panda-market-api-crud.vercel.app/articles`);
    const data = await res.json();
    return data;
}

export async function createArticle(articleData) {
  const res = await fetch(`https://panda-market-api-crud.vercel.app/articles`, {
    method: 'POST',
    body: JSON.stringify(articleData),
    headers: {
        'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  return data;
}

export async function patchArticle(id, articleData) {
    const res = await fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(articleData),
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const data = await res.json();
    return data;
}

export async function deleteArticle(id) {
    const res = await fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
        method: 'DELETE'
    });
    const data = await res.json();
    return data;
}

 import axios from 'axios';

 axios.post(`https://panda-market-api-crud.vercel.app/articles`, {
    title:'게시글 작성 테스트',
    content: '게시글 작성 테스트',
    image: 'https://example.com/...'
 })
 .then(response => {
    console.log('응답 데이터:', response.data);
 })
 .catch(error => {
    console.error('에러 발생:', error);
 });