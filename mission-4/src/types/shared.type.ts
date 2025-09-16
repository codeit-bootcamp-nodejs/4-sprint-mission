export type Content = 'products' | 'articles' | 'comments';

export type ParentContentType = Exclude<Content, 'comments'>;
export interface EntityId {
  id: number;
}
export interface UserId {
  userId: number;
}
export interface GetListParams extends UserId {
  keyword: string;
  page: number;
  pageSize: number;
}
