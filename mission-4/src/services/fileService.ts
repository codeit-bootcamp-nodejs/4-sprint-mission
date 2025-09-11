import { cloudinaryUpload, deleteCloudinaryFile } from '../lib/cloudinary.js';
import prisma from '../lib/prisma.js';

async function postFileService({ path }) {
  const result = await cloudinaryUpload(path);
  await prisma.image.create({
    data: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });
  return { imageUrl: result.secure_url }; // prettier-ignore
}

async function deleteFileService({ id }) {
  const img = await prisma.image.findUniqueOrThrow({
    where: id,
  });
  await deleteCloudinaryFile(img.publicId);
  await prisma.image.delete({
    where: id,
  });
  return img;
}

export { postFileService, deleteFileService };
