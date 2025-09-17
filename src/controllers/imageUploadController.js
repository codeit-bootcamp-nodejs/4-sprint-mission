import sharp from "sharp";
import { saveUploadedImages } from "../services/imageService.js";
import { makeAbsoluteUrl } from "../lib/utils.js";

export async function imageUploadController(req, res) {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ error: "파일이 업로드되지 않았습니다." });
  }

  try {
    // 모든 파일 실제 이미지인지 확인
    for (const file of files) {
      await sharp(file.path).metadata();
    }

    // DB 저장
    const images = await saveUploadedImages(null, files);

    // ✅ DB에 저장된 url 기준으로 절대경로 변환
    const imageUrls = images.map((img) => makeAbsoluteUrl(req, img.url));

    res.status(200).json({ urls: imageUrls });
  } catch {
    console.error("Image upload error:", err);
    res.status(500).json({ error: "이미지 업로드 중 오류 발생" });
  }
}
