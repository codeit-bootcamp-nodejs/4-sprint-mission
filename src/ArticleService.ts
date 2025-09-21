import { Article as PrismaArticle, Prisma } from '@prisma/client';
import ArticleRepository from './repositories/ArticleRepository';
import { ArticleCreateDto, ArticleUpdateDto } from './dtos/ArticleDto';

interface ArticleCreateServiceInput {
  title: string;
  content: string;
  userId: number;
}

class ArticleService {
  private articleRepository: ArticleRepository;

  constructor(articleRepository: ArticleRepository) {
    this.articleRepository = articleRepository;
  }

  async createArticle(data: ArticleCreateServiceInput): Promise<PrismaArticle> {
    const { userId, ...rest } = data;
    return this.articleRepository.createArticle({
      ...rest,
      user: { connect: { id: userId } },
    });
  }

  async getArticleById(id: number): Promise<PrismaArticle | null> {
    return this.articleRepository.findArticleById(id);
  }

  async getArticles(options?: {
    skip?: number;
    take?: number;
    where?: Prisma.ArticleWhereInput;
    orderBy?: Prisma.ArticleOrderByWithRelationInput;
  }): Promise<PrismaArticle[]> {
    return this.articleRepository.findArticles(options);
  }

  async updateArticle(id: number, data: ArticleUpdateDto): Promise<PrismaArticle> {
    return this.articleRepository.updateArticle(id, data);
  }

  async deleteArticle(id: number): Promise<PrismaArticle> {
    return this.articleRepository.deleteArticle(id);
  }
}

export default ArticleService;
