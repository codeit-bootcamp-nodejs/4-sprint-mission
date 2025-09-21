// src/controllers/upload.controller.js
import { Request, Response } from 'express';

export const uploadImage = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No image file provided' });
    return;
  }

  const imagePath = `/uploads/${req.file.filename}`;
  res.status(201).json({ imageUrl: imagePath });
};
