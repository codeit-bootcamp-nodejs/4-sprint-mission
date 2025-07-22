import ArticleService from "../services/ArticleService.js";

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
    createdId = created.id;
    console.log(`생성한 기사 id : ${createdId}`);
  } catch (err) {
    console.log("❌", err);
  }

  console.log("--------특정 기사 조회---------");
  try {
    const article = await ArticleService.getArticle(createdId);
    console.log(`[생성한 기사]`, article);
  } catch (err) {
    console.log("❌", err);
  }

  console.log("--------기사 수정---------");
  try {
    const patchData = { title: "제목 수정했음" };
    const updated = await ArticleService.patchArticle(createdId, patchData);
    console.log(`[기사 정보 수정 성공]`, updated);
  } catch (err) {
    console.log("❌", err);
  }

  console.log("--------기사 삭제---------");
  try {
    const deleted = await ArticleService.deleteArticle(createdId);
    console.log(`[기사 삭제 성공]`, deleted);
  } catch (err) {
    console.log("❌", err);
  }
}
