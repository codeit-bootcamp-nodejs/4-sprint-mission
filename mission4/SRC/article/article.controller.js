
import { ArticleService } from "./article.service.js";

export class ArticleController {
  constructor() {
    this.AS = new ArticleService();
  }
  async getArticlesListController(req, res) {
    console.log("getArticlesListController 호출됨");
    try {
      const { page, take, title, content, keyword } = req.query;
      // pagenation
      const pageNumber = Number(page) || 1;
      const takeNumber = Number(take) || 10;
      const skip = (pageNumber - 1) * takeNumber;
      console.log("title, content, keyword :",title, content, keyword )
      // validate
      if (title && typeof title !== "string")
        return res.status(400).json({ message: "title은 문자열이어야 합니다" });
      if (content && typeof content !== "string")
        return res.status(400).json({ message: "content는 문자열이어야 합니다" });


      const articleList = await this.AS.getArticlesList({
        takeNumber,
        skip,
        title,
        content,
        keyword,
      });
      res
        .status(200)
        .json({ message: "성공직인 게시글 배열조회", articleList });
    } catch (error) {
      res.status(500).json({ message: "서버 에러" });
      console.error(error);
    }
  }

  async getArticleController(req, res) {
    try {
      const articleId = Number(req.params.id);
      if (!Number.isInteger(articleId) || articleId <= 0) {
        return res
          .status(400)
          .json({ message: "유효하지 않은 게시글 ID입니다." });
      }
      console.log(articleId)
      const article = await this.AS.getArticle({ articleId });
      res.status(200).json({ message: "게시글 조회 성공", data: article });
    } catch (error) {
      // 서비스에서 던진 status가 있으면 그대로 사용
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      // 그 외는 서버 에러
      res.status(500).json({ message: "서버 에러" });
      console.error(error);
    }
  }

  async createArticleController(req, res) {
    // Todo : 로그인한 유저만 게시글 등록 가능
    try {
      const { title, content, name } = req.body;
      if (!name) throw { status: 400, message: "이름 써주세요" };
      if (!title) throw { status: 400, message: "빈 제목은 안됩니다." };
      if (!content) throw { status: 400, message: "빈 내용은 안됩니다." };
      if (typeof name !== "string")
        throw { status: 400, message: "이름은 문자열이어야 합니다." };
      if (typeof title !== "string" || typeof content !== "string")
        throw { status: 400, message: "제목과 내용은 문자열이어야 합니다." };

      const newArticle = await this.AS.createArticle({ title, content, name });
      res.status(201).json({ message: "게시글 조회 성공", newArticle });
    } catch (error) {
      res.status(500).json({ message: "서버 에러" });
      console.error(error);
    }
  }

  async patchArticleController(req, res) {
    // Todo : 게시글 등록한 유저만 해당 글 수정 가능
    try {
      const articleId = Number(req.params.id);
      const { title, content, name } = req.body;

      if (!Number.isInteger(articleId) || articleId <= 0) {
        return res
          .status(400)
          .json({ message: "유효하지 않은 게시글 ID입니다." });
      }
      if (!name) throw { status: 400, message: "이름 써주세요" };
      if (!title) throw { status: 400, message: "빈 제목은 안됩니다." };
      if (!content) throw { status: 400, message: "빈 내용은 안됩니다." };
      if (typeof name !== "string")
        throw { status: 400, message: "이름은 문자열이어야 합니다." };
      if (typeof title !== "string" || typeof content !== "string")
        throw { status: 400, message: "제목과 내용은 문자열이어야 합니다." };

      const article = await this.AS.getArticle({ articleId });

      const updatedArticle = await this.AS.patchArticle({
        articleId,
        title,
        content,
      });
      res.status(200).json({ message: "게시글 수정 완료", updatedArticle });
    } catch (error) {
      res.status(500).json({ message: "서버 에러" });
      console.error(error);
    }
  }

  async deleteArticleController(req, res) {
    // Todo : 게시글 등록한 유저만 해당 내리기 가능
    try {
      const articleId = Number(req.params.id);
      const article = await this.AS.getArticle({ articleId });
      const deletedArticle = await this.AS.deleteArticle({ articleId });
      res.status(200).json({ message: "게시글 삭제 완료", deletedArticle });
    } catch (error) {
      res.status(500).json({ message: "서버 에러" });
      console.error(error);
    }
  }
}
