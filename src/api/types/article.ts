export interface CreateArticleData {
  title: string;
  content: string;
}

export interface UpdateArticleData {
  title?: string;
  content?: string;
}

export type FindManyArticleParams = {
  offset: number;
  limit: number;
  order?: string;
  keyword?: string;
};
