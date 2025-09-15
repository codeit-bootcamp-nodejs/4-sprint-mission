import * as z from "zod";

const imageType = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const imageSchema = z.object({
  // 일단 이미지 파일만 테스트
  mimetype: z.enum(imageType),
  filename: z.string(),
  path: z.string(),
});
