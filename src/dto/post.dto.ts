// 포스트 생성 요청 DTO
export interface CreatePostDto {
  title: string;
  content: string;
  userId: number;
}

// 포스트 수정 요청 DTO
export interface UpdatePostDto {
  title?: string;
  content?: string;
  userId?: number;
}

// 포스트 응답 DTO
export interface PostResponseDto {
  id: number;
  title: string;
  content: string;
  userId: number;
}

// 포스트 목록 응답 DTO
export interface PostsResponseDto {
  posts: PostResponseDto[];
  total: number;
  page?: number;
  limit?: number;
}