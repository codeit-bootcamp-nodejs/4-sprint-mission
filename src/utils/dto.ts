import { RequiredString, RequiredInt, RequiredArray } from "./decorators";

export class ArticleDto {
  @RequiredString("제목", 1, 50)
  title!: string;

  @RequiredString("내용", 1, 1000)
  content!: string;
}

export class ProductDto {
  @RequiredString("이름", 1, 30)
  name!: string;

  @RequiredString("내용", 1, 100)
  description!: string;

  @RequiredInt("가격")
  price!: number;

  @RequiredArray("태그")
  tags!: string[];
}

export class CommentDto {
  @RequiredString("댓글 내용", 1, 50)
  content!: string;
}
