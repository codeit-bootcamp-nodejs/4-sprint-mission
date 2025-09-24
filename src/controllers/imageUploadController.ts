import prisma from "../lib/prisma.js";
import sharp from "sharp";
import fs from "fs";
import { saveUploadedImages } from "../services/imageUploadService.js";
import { makeAbsoluteUrl } from "../lib/utils.js";
import multer from "multer";
import path from "path";
import type { FileRequest } from "../types/controller/FileRequest.controller.types.js";
import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

const MAX_WIDTH = 2000; // 최대 이미지 가로 크기
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type FileController<ResBody = unknown> = RequestHandler<
  ParamsDictionary,
  ResBody
>;

export const imageUploadController: FileController<
  { urls: string[] } | { error: string }
> = async (req, res, next) => {
  // 1️⃣ 업로드 파일 배열 정리
  const fileReq = req as FileRequest; // 타입 단언
  const files = Array.isArray(fileReq.files)
    ? fileReq.files
    : fileReq.files
    ? Object.values(fileReq.files).flat()
    : [];

  if (!files.length)
    return res.status(400).json({ error: "업로드된 파일이 없습니다." });

  try {
    const validFiles: Express.Multer.File[] = [];

    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (
        !ALLOWED_EXTENSIONS.includes(ext) ||
        !ALLOWED_MIME_TYPES.includes(file.mimetype)
      ) {
        // 잘못된 파일은 제거
        await fs.promises.unlink(file.path).catch(() => {});
        continue;
      }

      try {
        // 2️⃣ Sharp로 재인코딩 + 크기 제한 → 악성 payload 제거
        const buffer = await sharp(file.path)
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .toFormat("png") // PNG로 변환
          .toBuffer();
        await fs.promises.writeFile(file.path, buffer);

        validFiles.push(file);
      } catch {
        // 손상 이미지 삭제
        await fs.promises.unlink(file.path).catch(() => {});
      }
    }

    if (!validFiles.length)
      return res.status(400).json({ error: "유효한 이미지가 없습니다." });

    // 3️⃣ DB 저장
    const images = await saveUploadedImages(prisma, validFiles);

    // 4️⃣ 업로드 로그 기록
    for (const file of validFiles) {
      await prisma.uploadLog.create({
        data: {
          userId: req.user?.id || null,
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        },
      });
    }

    // 5️⃣ 절대 경로 변환
    const imageUrls = images.map((img) => makeAbsoluteUrl(img.url, req) ?? "");

    res.status(200).json({ urls: imageUrls });
  } catch (error: any) {
    // MulterError 처리
    if (error instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ error: `파일 업로드 오류: ${error.message}` });
    }
    next(error);
  }
};
