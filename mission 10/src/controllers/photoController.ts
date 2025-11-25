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
      const imageUrl = (req.file as any).location;

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