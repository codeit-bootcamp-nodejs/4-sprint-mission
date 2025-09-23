export class GetArticlesResponseDto {
  id!: number;
  title!: string;
  content!: string;
  createdAt!: Date;
  updatedAt!: Date;
  authorId!: number;
  author!: {
    id: number;
    nickname: string;
    email: string;
  };
  isLiked!: boolean;
}
