export interface CreateArticleDTO {
  title: string;
  content: string;
  userId: number;
}

export interface UpdateArticleDTO {
  id: number;
  title?: string;
  content?: string;
  userId: number;
}
