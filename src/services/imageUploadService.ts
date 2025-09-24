import prisma from "../lib/prisma.js";
import type { Prisma } from "@prisma/client";
import type { Express } from "express";

/**
 * DB에 이미지 저장 후 반환
 * @param tx - Prisma 트랜잭션 객체
 * @param files - 업로드된 파일 배열
 */
export async function saveUploadedImages(
  tx: Prisma.TransactionClient | typeof prisma,
  files: Express.Multer.File[]
) {
  if (!files || files.length === 0) {
    throw new Error("파일이 업로드되지 않았습니다.");
  }

  // MIME 타입 체크
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  for (const file of files) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(`${file.originalname}은 지원되지 않는 파일 형식입니다.`);
    }
  }

  // 이미지 레코드 DB 저장
  const images = await tx.image.createManyAndReturn({
    data: files.map((file) => ({
      url: `/images/${file.filename}`,
    })),
  });

  return images;
}
