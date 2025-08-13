// src/controllers/upload.controller.js
export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const imagePath = `/uploads/${req.file.filename}`;
  res.status(201).json({ imageUrl: imagePath });
};
