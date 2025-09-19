import z from "zod";

export const ArticleSchema = z.object({
  title: z.string().min(1, { message: "제목을 입력하세요." }),
  content: z.string().min(1, { message: "내용을 입력하세요." }),
});
