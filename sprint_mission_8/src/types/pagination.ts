export interface PagePaginationParams {
  page: number;
  pageSize: number;
  orderBy?: 'recent' | 'oldest';
  keyword?: string;
}

export interface PagePaginationResult<T> {
  list: T[];
  totalCount: number;
}

export interface CursorPaginationParams {
  cursor: number;
  limit: number;
}

export interface CursorPaginationResult<T> {
  list: T[];
  nextCursor: number | null;
}
