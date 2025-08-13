export function getArticleList(params = {}) {
  const url = new URL("https://panda-market-api-crud.vercel.app/articles");
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data);
}

export function getArticle(id) {
  return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`)
    .then((res) => res.json())
    .then((data) => data)
    .catch((error) => {
      return { message: "string" };
    });
}

export function createArticle() {
  return fetch("https://panda-market-api-crud.vercel.app/articles", {
    method: "POST",
    body: JSON.stringify({
      title: "게시글 제목입니다.",
      content: "게시글 내용입니다.",
      image: "https://example.com/...",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);
}

export function patchArticle(id) {
  return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);
}

export function deleteArticle(id) {
  return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => data);
}
