// import express from "express";
// import asyncHandler from "../middlewares/asyncHandler.js";
// import upload from "../middlewares/multer.js";

// const fileRouter = express.Router();

// fileRouter.post(
//     "/", // 라우터 경로(Router Path) 또는 엔드포인트 경로(Endpoint Path)
//     upload.single("attachment"),
//     asyncHandler(async (req, res) => {
//         if (!req.file) {
//             return res.status(400).json({ message: "파일이 첨부되지 않았습니다." });
//         }
        
//         // req.file 객체에서 필요한 정보를 추출합니다.
//         const filename = req.file.filename; // 파일 이름
//         const path = `/files/${filename}`; // 파일 경로
//         const originalname = req.file.originalname; // 원본 파일 이름
//         const mimetype = req.file.mimetype; // 파일의 MIME 타입
        
//         // 응답 JSON에 원본 파일 이름 정보를 추가하여 반환합니다.
//         res.json({ 
//             path,
//             filename,
//             originalname,
//             mimetype,
//         });
//     })
// );

// export default fileRouter;