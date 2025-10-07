import { CommentService } from "../comment/comment.service.js";
import { ProductService } from "../product/product.service.js";
import { ArticleService } from "../article/article.service.js";
export const isCommentOwner = async (req, res, next) => {
  const comment = await CommentService.getComment(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.userId !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });
  next();
};
export const isProductOwner = async (req, res, next) => {
  const product = await ProductService.getProduct(req.params.id);
  if (!product) return res.status(404).json({ message: "product not found" });
  if (product.userId !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });
  next();
};

export const isArticleOwner = async (req, res, next) => {
  const article = await ArticleService.getArticle(req.params.id);
  if (!article) return res.status(404).json({ message: "Article not found" });
  if (article.userId !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });
  next();
};
