export interface ArticleListQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
  [key: string]: any;
}

export interface ArticleData {
  id: string;
  title: string;
  content: string;
  likeCount: number;
  createdAt: number;
}

export interface CreateArticleDto {
  title: string;
  content: string;
}

export interface PatchArticleDto {
  title: string;
  content: string;
}

export interface ArticleListResponse {
  list: ArticleData[];
}

export function isArticleData(item: unknown): item is ArticleData {
  if (typeof item !== "object" || item === null) return false;
  const article = item as Record<string, unknown>;
  return (
    typeof article.id === "string" &&
    typeof article.title === "string" &&
    typeof article.content === "string" &&
    typeof article.writer === "string" &&
    typeof article.likeCount === "number" &&
    typeof article.createdAt === "number"
  );
}
