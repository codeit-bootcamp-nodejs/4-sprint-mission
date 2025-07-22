const BASE_URL = "https://panda-market-api-crud.vercel.app/articles";

const ArticleService = {
  // 기사 목록 조회
  getArticleList(query) {
    const url = new URL(BASE_URL);

    for (let key in query) {
      if (query[key] !== undefined) {
        url.searchParams.append(key, query[key]);
      }
    }

    return fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`[error] 상태 코드: ${res.status}`);
        return res.json();
      })
      .catch((err) => {
        console.log("[error] 요청 실패:", err.message);
        throw err;
      });
  },

  // 특정 기사 조회
  getArticle(id) {
    return fetch(`${BASE_URL}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`[error] 상태 코드: ${res.status}`);
        return res.json();
      })
      .catch((err) => {
        console.log("[error] 요청 실패:", err.message);
        throw err;
      });
  },

  // 기사 생성
  createArticle(articleData) {
    return fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(articleData),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`[error] 상태 코드: ${res.status}`);
        return res.json();
      })
      .catch((err) => {
        console.log("[error] 요청 실패:", err.message);
        throw err;
      });
  },

  // 기사 수정
  patchArticle(id, articlePatchData) {
    return fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(articlePatchData),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`[error] 상태 코드: ${res.status}`);
        return res.json();
      })
      .catch((err) => {
        console.log("[error] 요청 실패:", err.message);
        throw err;
      });
  },

  // 기사 삭제
  deleteArticle(id) {
    return fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`[error] 상태 코드: ${res.status}`);
        return res.json();
      })
      .catch((err) => {
        console.log("[error] 요청 실패:", err.message);
        throw err;
      });
  },
};

export default ArticleService;
