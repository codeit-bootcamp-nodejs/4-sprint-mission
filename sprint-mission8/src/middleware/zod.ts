import { z } from "zod";
import isUuid from "is-uuid";
import isemail from "is-email"

const uuidSchema = z.string().refine(isUuid, {
  message: "잘못된 ID 형식입니다.",
});

const uuemaileSchema = z.string().refine(isemail, {
  message: "잘못된 e-mail 형식입니다.",
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
  id: uuidSchema.optional(),
  content: z.string().min(10).max(1000),
  productId: uuidSchema.optional(),
});

const ArticleComment = z.object({
  id: uuidSchema.optional(),
  content: z.string().min(10).max(1000),
  articleId: uuidSchema.optional(),
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

const CreateUserId = z.object({
  id: uuidSchema.optional(),
  email : uuemaileSchema,
  nickname: z.string().min(2).max(100),
  password : z.string().trim().min(4, '비밀번호는 최소 4자 이상!')
});

const PatchUserId = CreateUserId.partial();

export default {
  CreateProduct: createValidationMiddleware(CreateProduct),
  CreateArticle: createValidationMiddleware(CreateArticle),
  PatchProduct: createValidationMiddleware(PatchProduct),
  PatchArticle: createValidationMiddleware(PatchArticle),
  ProductComment: createValidationMiddleware(ProductComment),
  ArticleComment: createValidationMiddleware(ArticleComment),
  PatchProductComment: createValidationMiddleware(PatchProductComment),
  PatchArticleComment: createValidationMiddleware(PatchArticleComment),
  CreateUserId : createValidationMiddleware(CreateUserId),
  PatchUserId : createValidationMiddleware(PatchUserId),
};