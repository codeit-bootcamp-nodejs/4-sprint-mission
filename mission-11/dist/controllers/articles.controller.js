import { ArticlesService } from '../services/articles.service.js';
export class ArticlesController {
    constructor() {
        this.articlesService = new ArticlesService();
        // 게시글 생성
        this.createArticle = async (req, res, next) => {
            try {
                const createArticleDto = req.body; // Use DTO
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "인증 정보가 없습니다." });
                }
                const userId = user.id;
                if (!createArticleDto.title || !createArticleDto.content) { // Validate DTO fields
                    return res.status(400).json({ message: '제목과 내용을 모두 입력해주세요.' });
                }
                const newArticle = await this.articlesService.createArticle(createArticleDto, userId); // Pass DTO
                return res.status(201).json({ data: newArticle });
            }
            catch (err) {
                next(err);
            }
        };
        // 게시글 목록 조회
        this.getArticles = async (req, res, next) => {
            try {
                const articles = await this.articlesService.getArticles();
                return res.status(200).json({ data: articles });
            }
            catch (err) {
                next(err);
            }
        };
        // 게시글 상세 조회
        this.getArticleById = async (req, res, next) => {
            try {
                const { articleId } = req.params;
                const user = req.user; // Optional user for isLiked check
                if (isNaN(parseInt(articleId))) {
                    return res.status(400).json({ message: '유효하지 않은 게시글 ID입니다.' });
                }
                const article = await this.articlesService.getArticleById(+articleId, user?.id);
                return res.status(200).json({ data: article });
            }
            catch (err) {
                if (err.name === "NotFoundError") {
                    return res.status(404).json({ message: err.message });
                }
                next(err);
            }
        };
        // 게시글 수정
        this.updateArticle = async (req, res, next) => {
            try {
                const { articleId } = req.params;
                const updateArticleDto = req.body; // Use DTO
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "인증 정보가 없습니다." });
                }
                const userId = user.id;
                const updatedArticle = await this.articlesService.updateArticle(+articleId, userId, updateArticleDto); // Pass DTO
                return res.status(200).json({ data: updatedArticle });
            }
            catch (err) {
                if (err.name === "NotFoundError") {
                    return res.status(404).json({ message: err.message });
                }
                if (err.name === "ForbiddenError") {
                    return res.status(403).json({ message: err.message });
                }
                if (err.name === "BadRequestError") {
                    return res.status(400).json({ message: err.message });
                }
                next(err);
            }
        };
        // 게시글 삭제 
        this.deleteArticle = async (req, res, next) => {
            try {
                const { articleId } = req.params;
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "인증 정보가 없습니다." });
                }
                const userId = user.id;
                await this.articlesService.deleteArticle(+articleId, userId);
                return res.status(200).json({ message: '게시글이 성공적으로 삭제되었습니다.' });
            }
            catch (err) {
                if (err.name === "NotFoundError") {
                    return res.status(404).json({ message: err.message });
                }
                if (err.name === "ForbiddenError") {
                    return res.status(403).json({ message: err.message });
                }
                next(err);
            }
        };
        // 게시글 좋아요/좋아요 취소
        this.toggleArticleLike = async (req, res, next) => {
            try {
                const { articleId } = req.params;
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "인증 정보가 없습니다." });
                }
                const userId = user.id;
                const result = await this.articlesService.toggleArticleLike(+articleId, userId);
                return res.status(200).json(result);
            }
            catch (err) {
                if (err.name === "NotFoundError") {
                    return res.status(404).json({ message: err.message });
                }
                next(err);
            }
        };
    }
}
