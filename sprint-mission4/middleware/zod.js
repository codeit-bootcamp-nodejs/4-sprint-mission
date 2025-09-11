import { z } from "zod";
import isUuid from "is-uuid"

const uuidSchema = z.string().refine(isUuid, {
  message: "Invalid UUID format",
});

const CreateProduct = z.object({
  id: uuidSchema.optional(),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  price: z.number().min(0),
  tags: z.array(z.string().min(2).max(100)),
});

const CreateArticle = z.object({
  id: uuidSchema.optional(),
  title: z.string().min(2).max(100),
  content: z.string().min(2).max(1000),
});

const ProductComment = z.object({
  id: uuidSchema,
  content: z.string().min(10).max(1000),
  productId: uuidSchema,
  articleId: uuidSchema,
});

const ArticleComment = z.object({
  id: uuidSchema,
  content: z.string().min(10).max(1000),
  productId: uuidSchema,
  articleId: uuidSchema,
});

const PatchProduct = CreateProduct.partial();
const PatchArticle = CreateArticle.partial();
const PatchProductComment = ProductComment.partial();
const PatchArticleComment = ArticleComment.partial();

const createValidationMiddleware = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors || error.issues });
  }
};

export default {
  CreateProduct: createValidationMiddleware(CreateProduct),
  CreateArticle: createValidationMiddleware(CreateArticle),
  PatchProduct: createValidationMiddleware(PatchProduct),
  PatchArticle: createValidationMiddleware(PatchArticle),
  ProductComment: createValidationMiddleware(ProductComment),
  ArticleComment: createValidationMiddleware(ArticleComment),
  PatchProductComment: createValidationMiddleware(PatchProductComment),
  PatchArticleComment: createValidationMiddleware(PatchArticleComment),
};