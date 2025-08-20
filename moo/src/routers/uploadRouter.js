import express from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post(
    "/",
    upload.single("attachment"),
    asyncHandler(async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "파일이 첨부되지 않았습니다." });
        }
     
        const filename = req.file.filename; 
        const path = `/files/${filename}`; 
        const originalname = req.file.originalname; 
        const mimetype = req.file.mimetype; 
        
        res.json({ 
            path,
            filename,
            originalname,
            mimetype,
        });
    })
);

export default router;