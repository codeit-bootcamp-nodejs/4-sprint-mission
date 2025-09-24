import { create } from "node_modules/axios/index.cjs";
import ArticleService from "../services/article/article.service.js";
import { isArticleData } from "../services/article/article.dto.js";

// const res = await ArticleService.getArticleList();
// console.log(res.list.length);

// const res = await ArticleService.getArticle(1234);
// console.log(res);

export async function testAllArticleService() {
  let createdId = null;

  console.log("--------기사 목록 조회---------");
  try {
    const query = { page: 1, pageSize: 3, keyword: "게시글" };
    const res = await ArticleService.getArticleList(query);
    console.log(`기사 ${res.list.length}개 조회 성공`);
  } catch (err) {
    console.log("❌", err);
  }

  console.log("--------기사 생성---------");
  try {
    const newArticle = {
      title: "새로 생성한 기사",
      content: "기사 내용",
      image: "https://example.com/...",
    };
    const created = await ArticleService.createArticle(newArticle);

    if (isArticleData(created)) {
      createdId = created.id;
    }
    console.log(`생성한 기사 id : ${createdId}`);
  } catch (err) {
    console.log("❌", err);
  }

  console.log("--------특정 기사 조회---------");
  try {
    if (createdId) {
      const article = await ArticleService.getArticle(createdId);
      console.log(`[생성한 기사]`, article);
    }
  } catch (err) {
    console.log("❌", err);
  }

  console.log("--------기사 수정---------");
  try {
    const patchData = { title: "제목 수정했음", content: "수정된 내용" };
    if (createdId) {
      const updated = await ArticleService.patchArticle(createdId, patchData);
      console.log(`[기사 정보 수정 성공]`, updated);
    }
  } catch (err) {
    console.log("❌", err);
  }

  console.log("--------기사 삭제---------");
  try {
    if (createdId) {
      const deleted = await ArticleService.deleteArticle(createdId);
      console.log(`[기사 삭제 성공]`, deleted);
    }
  } catch (err) {
    console.log("❌", err);
  }
  console.log("--------기사 목록 조회---------");
  try {
    const query = { page: 1, pageSize: 3, keyword: "게시글" };
    const res = await ArticleService.getArticleList(query);
    console.log(res.list);
  } catch (err) {
    console.log("❌", err);
  }
}
