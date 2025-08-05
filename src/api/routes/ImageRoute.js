import express from "express";
import upload from "../middlewares/upload.js";
import ImageController from "../controllers/ImageController.js";

const router = express.Router();

router.post("/upload", upload.single("image"), ImageController.uploadImage);

export default router;
