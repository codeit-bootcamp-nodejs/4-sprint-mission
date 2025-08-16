import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// uploads 폴더가 없으면 생성
try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 생성합니다.");
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        // 1. uuid 라이브러리를 사용하여 고유한 ID를 생성합니다.
        const uniqueId = uuidv4();

        // 2. 파일의 원본 확장자를 가져옵니다.
        const extension = path.extname(file.originalname);

        // 3. 고유한 ID와 확장자를 조합하여 최종 파일명을 생성합니다.
        cb(null, uniqueId + extension); // 예: 461c1284e50e7b009a40a324c9e41e76.jpeg
    },
});

const upload = multer({ storage: storage });

export default upload;

//파일을 어떻게 받아서 어떻게 하겠다. 
//multer 설정