export class GetProductResponseDto {
  id!: number;
  name!: string;
  description!: string | null;
  price!: number;
  tags!: string[];
  author!: {
    id: number;
    nickname: string;
    email: string;
  };
  isLiked!: boolean;
}
