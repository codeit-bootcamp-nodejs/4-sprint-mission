import { Router } from "express";
import upload from "../middlewares/upload.middleware.js";

const uploadsRouter = Router();

//단일 이미지 업로드 API
uploadsRouter.post('/', upload.single('image'), (req, res, next) => {
    try {
        if(!req.file) { 
            return res.status(400).json({ message: "파일에 이미지가 없음"});
        }

        //업로드된 파일의 경로를 응답으로 반환
        const fileUrl = `/uploads/${req.file.filename}`;
        res.status(201).json({ message: "이미지 업로드 성공", imageUrl: fileUrl});
    } catch(error) {
        next(error);
    }
});

export default uploadsRouter;
