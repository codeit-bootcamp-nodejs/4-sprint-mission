import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import status from "http-status";

export class PhotoController {
  async upload(req: Request, res: Response, next: NextFunction) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (!req.file) {
      return res.status(status.BAD_REQUEST).json({ message: "No file uploaded" });
    }

    try {
      // 파일 저장 위치 → 지금은 로컬, 나중에 S3 같은 외부 스토리지로 확장 가능
      const imageUrl = `/download/${req.file.filename}`;

      // 📌 기본 동작: 유저 프로필 업데이트
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { image: imageUrl },
      });

      res.status(status.OK).json({
        message: "Photo uploaded successfully",
        image: updatedUser.image,
      });
    } catch (err) {
      next(err);
    }
  }
}