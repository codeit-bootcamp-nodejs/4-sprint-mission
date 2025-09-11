import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "./constants.js";
import fs from "fs";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function cloudinaryUpload(path) {
  const result = await cloudinary.uploader.upload(path, {
    folder: "mission4_files",
  });
  fs.unlinkSync(path);
  console.log("Cloudinary에 이미지 업로드 완료");
  return result;
}

export async function deleteCloudinaryFile(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Cloudinary에서 이미지 ${publicId} 삭제 성공`);
  } catch (e) {
    throw new Error(
      `Cloudinary에서 이미지 ${publicId} 삭제 실패: ${e.message}`
    );
  }
}
