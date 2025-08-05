//getArticleList
export async function getArticleList(params) {
    const url = new URL(`https://panda-market-api-crud.vercel.app/articles`);
    Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
    );

    const res = await fetch(url);
    const data = await res.json();
    return data;
}

//getArticle
export async function getArticle() {
    const res = await fetch (`https://panda-market-api-crud.vercel.app/articles`);
    const data = await res.json();
    return data;
}

//createArticle
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

//patchArticle
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

//deleteArticle
export async function deleteArticle(id) {
    const res = await fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
        method: 'DELETE'
    });
    const data = await res.json();
    return data;
}