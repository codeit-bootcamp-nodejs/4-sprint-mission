import axios from "axios";

const BASE_URL = "https://panda-market-api-crud.vercel.app/articles";

// Article 상품 목록을 검색하는 함수
export function getArticleList(page = 1, pageSize = 10, keyword = "") {
  const url = new URL(BASE_URL);
  url.searchParams.append("page", page);
  url.searchParams.append("pageSize", pageSize);

  if (typeof keyword === "string" && keyword.trim()) {
    url.searchParams.append("keyword", keyword.trim());
  }

  console.log(url.toString());

  return axios
    .get(url.toString())
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((error) => {
      console.log(error.message);
    });
}

// Article ID의 상세정보를 조회하는 함수
export function getArticle(id) {
  return axios
    .get(`${BASE_URL}/${id}`)
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((error) => {
      console.error(error.message);
    });
}

// Article 새로운 상품을 추가하는 함수
export function createArticle({ title, content, image }) {
  const requestBody = {
    title,
    content,
    image,
  };
  return axios
    .post(BASE_URL, requestBody)
    .then((res) => {
      console.log("입력", requestBody);
      console.log("성공", res.data);
      return res.data;
    })
    .catch((error) => {
      console.error("POST 실패", error.message);
    });
}

// Article ID의 정보를 변경하는 함수
export function patchArticle(id, update) {
  return axios
    .patch(`${BASE_URL}/${id}`, update)
    .then((res) => {
      console.log("업데이트 성공", res.data);
      return res.data;
    })
    .catch((error) => {
      console.error("업데이트 실패", error.message);
    });
}

//Article ID를 삭제하는 함수
export function deleteArticle(id) {
  console.log("삭제할 ID :", id);
  return axios
    .delete(`${BASE_URL}/${id}`)
    .then((res) => {
      console.log(`ID : ${id} 삭제 성공`);
      return res.data;
    })
    .catch((error) => {
      console.error("삭제 실패", error.message);
    });
}
