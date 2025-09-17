import prisma from "../lib/prisma.js";

export async function saveUploadedImages(txOrFiles, maybeFiles) {
  // tx가 넘어왔는지 여부 확인
  const tx = maybeFiles ? txOrFiles : prisma;
  const files = maybeFiles || txOrFiles;

  if (!files || files.length === 0) {
    throw new Error("파일이 업로드되지 않았습니다.");
  }

  // DB에 Image 레코드 생성 후 반환
  const images = await tx.image.createManyAndReturn({
    data: files.map((file) => ({
      url: `/images/${file.filename}`,
    })),
  });

  return images;
}
