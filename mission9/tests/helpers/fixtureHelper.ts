import { Article, Product, Comment } from '@prisma/client';
import { getTestPrisma } from './dbHelper';

const prisma = getTestPrisma();

/**
 * Create a test product
 */
export async function createTestProduct(
  userId: number,
  overrides: Partial<{
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
  }> = {}
): Promise<Product> {
  return prisma.product.create({
    data: {
      name: overrides.name || `Test Product ${Date.now()}`,
      description: overrides.description || 'Test product description',
      price: overrides.price || 10000,
      tags: overrides.tags || ['test', 'product'],
      images: overrides.images || ['https://example.com/image.jpg'],
      userId,
    },
  });
}

/**
 * Create multiple test products
 */
export async function createTestProducts(
  userId: number,
  count: number
): Promise<Product[]> {
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    const product = await createTestProduct(userId, {
      name: `Test Product ${Date.now()}-${i}`,
      price: 10000 + i * 1000,
    });
    products.push(product);
    // Add delay to ensure different createdAt timestamps
    if (i < count - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  return products;
}

/**
 * Create a test article
 */
export async function createTestArticle(
  userId: number,
  overrides: Partial<{
    title: string;
    content: string;
    image: string;
  }> = {}
): Promise<Article> {
  return prisma.article.create({
    data: {
      title: overrides.title || `Test Article ${Date.now()}`,
      content: overrides.content || 'Test article content',
      image: overrides.image || 'https://example.com/article.jpg',
      userId,
    },
  });
}

/**
 * Create multiple test articles
 */
export async function createTestArticles(
  userId: number,
  count: number
): Promise<Article[]> {
  const articles: Article[] = [];
  for (let i = 0; i < count; i++) {
    const article = await createTestArticle(userId, {
      title: `Test Article ${Date.now()}-${i}`,
    });
    articles.push(article);
    // Add delay to ensure different createdAt timestamps
    if (i < count - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  return articles;
}

/**
 * Create a test comment on a product
 */
export async function createTestCommentOnProduct(
  userId: number,
  productId: number,
  content?: string
): Promise<Comment> {
  return prisma.comment.create({
    data: {
      content: content || 'Test comment',
      userId,
      productId,
    },
  });
}

/**
 * Create a test comment on an article
 */
export async function createTestCommentOnArticle(
  userId: number,
  articleId: number,
  content?: string
): Promise<Comment> {
  return prisma.comment.create({
    data: {
      content: content || 'Test comment',
      userId,
      articleId,
    },
  });
}

/**
 * Create a favorite for a product
 */
export async function createTestFavorite(userId: number, productId: number) {
  return prisma.favorite.create({
    data: {
      userId,
      productId,
    },
  });
}

/**
 * Create a like for an article
 */
export async function createTestLike(userId: number, articleId: number) {
  return prisma.like.create({
    data: {
      userId,
      articleId,
    },
  });
}
