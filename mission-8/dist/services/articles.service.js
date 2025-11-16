import { ArticlesRepository } from '../repositories/articles.repository.js';
export class ArticlesService {
    constructor() {
        this.articlesRepository = new ArticlesRepository();
        this.createArticle = async (createArticleDto, userId) => {
            const { title, content } = createArticleDto; // Destructure DTO
            const newArticle = await this.articlesRepository.createArticle({
                title,
                content,
                author: {
                    connect: { id: userId },
                },
            });
            return newArticle;
        };
        this.getArticles = async () => {
            const articles = await this.articlesRepository.findArticles();
            return articles;
        };
        this.getArticleById = async (articleId, userId) => {
            const article = await this.articlesRepository.findArticleById(articleId);
            if (!article) {
                const err = new Error("게시글을 찾을 수 없습니다.");
                err.name = "NotFoundError";
                throw err;
            }
            let isLiked = false;
            if (userId) {
                const like = await this.articlesRepository.findArticleLike(userId, articleId);
                if (like) {
                    isLiked = true;
                }
            }
            const responseArticle = { ...article, isLiked };
            return responseArticle;
        };
        this.updateArticle = async (articleId, userId, updateArticleDto) => {
            const { title, content } = updateArticleDto; // Destructure DTO
            const article = await this.articlesRepository.findArticleByIdSimple(articleId);
            if (!article) {
                const err = new Error("게시글을 찾을 수 없습니다.");
                err.name = "NotFoundError";
                throw err;
            }
            if (article.authorId !== userId) {
                const err = new Error("게시글을 수정할 권한이 없습니다.");
                err.name = "ForbiddenError";
                throw err;
            }
            if (!title && !content) {
                const err = new Error("수정할 정보를 하나 이상 입력해주세요.");
                err.name = "BadRequestError";
                throw err;
            }
            const dataToUpdate = {};
            if (title)
                dataToUpdate.title = title;
            if (content)
                dataToUpdate.content = content;
            const updatedArticle = await this.articlesRepository.updateArticle(articleId, dataToUpdate);
            return updatedArticle;
        };
        this.deleteArticle = async (articleId, userId) => {
            const article = await this.articlesRepository.findArticleByIdSimple(articleId);
            if (!article) {
                const err = new Error("게시글을 찾을 수 없습니다.");
                err.name = "NotFoundError";
                throw err;
            }
            if (article.authorId !== userId) {
                const err = new Error("게시글을 삭제할 권한이 없습니다.");
                err.name = "ForbiddenError";
                throw err;
            }
            await this.articlesRepository.deleteArticle(articleId);
        };
        this.toggleArticleLike = async (articleId, userId) => {
            const article = await this.articlesRepository.findArticleByIdSimple(articleId);
            if (!article) {
                const err = new Error("게시글을 찾을 수 없습니다.");
                err.name = "NotFoundError";
                throw err;
            }
            const existingLike = await this.articlesRepository.findArticleLike(userId, articleId);
            if (existingLike) {
                await this.articlesRepository.deleteArticleLike(userId, articleId);
                return { message: '게시글 좋아요를 취소했습니다.' };
            }
            else {
                await this.articlesRepository.createArticleLike(userId, articleId);
                return { message: '게시글에 좋아요를 눌렀습니다.' };
            }
        };
    }
}
