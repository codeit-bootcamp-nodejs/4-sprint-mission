import { z } from "zod";
import isUuid from "is-uuid"

const uuidSchema = z.string().refine(isUuid, {
  message: "Invalid UUID format",
});

const CreateProduct = z.object({
  id: uuidSchema,
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  price: z.number().min(0),
  tags: z.array(z.string().min(2).max(100)),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const CreateArticle = z.object({
  id: uuidSchema,
  title: z.string().min(2).max(100),
  content: z.string().min(10).max(1000),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const ProductComment = z.object({
  id: uuidSchema,
  content: z.string().min(10).max(1000),
  createdAt: z.date(),
  updatedAt: z.date(),
  productId: uuidSchema,
  articleId: uuidSchema,
});

const ArticleComment = z.object({
  id: uuidSchema,
  content: z.string().min(10).max(1000),
  createdAt: z.date(),
  updatedAt: z.date(),
  productId: uuidSchema,
  articleId: uuidSchema,
});

const PatchProduct = CreateProduct.partial();
const PatchArticle = CreateArticle.partial();
const PatchProductComment = ProductComment.partial();
const PatchArticleComment = ArticleComment.partial();

export { CreateProduct, CreateArticle, PatchProduct, PatchArticle, ProductComment, ArticleComment, PatchProductComment, PatchArticleComment };