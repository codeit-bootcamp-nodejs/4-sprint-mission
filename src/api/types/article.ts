export interface CreateArticleData {
  title: string;
  content: string;
}

export interface UpdateArticleData {
  title?: string;
  content?: string;
}

export type ArticleOrder = "oldest" | "recent";

// export type FindManyArticleParams = {
//   offset: number;
//   limit: number;
//   order: ArticleOrder;
//   keyword?: string;
// };
