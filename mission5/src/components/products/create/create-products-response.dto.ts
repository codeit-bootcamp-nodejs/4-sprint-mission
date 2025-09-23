export class CreateProductResponseDto {
  id!: number;
  name!: string;
  description!: string | null;
  price!: number;
  tags!: string[];
  authorId!: number;
}
