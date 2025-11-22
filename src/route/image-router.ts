import express from "express";
import { ImageController } from "../controller/image-controller.js";
import { ImageMiddleware } from "../middleware/image-middleware.js";

const imageRouter = (
  imageController: ImageController,
  imageMiddleware: ImageMiddleware
) => {
  const router = express.Router();

  router.post(
    "/",
    imageMiddleware.upload.single("image"),
    imageMiddleware.resizeAndUpload,
    imageController.uploadImage
  );

  return router;
};

export default imageRouter;
