import express from "express";
import productRoutes from "./routes/productRoutes.js";
import multer from "multer";
import path from "path";


const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 업로드된 파일이 저장될 디렉토리 (미리 생성되어 있어야 함)
    // cb는 callback 이라는 뜻...
    cb(null, 'uploads/'); // 'uploads/' 디렉토리에 저장
  },
  filename: function (req, file, cb) {
    // 저장될 파일 이름 설정
    // 원본 파일명에서 확장자를 추출하여 고유한 이름으로 저장 (중복 방지)
    const ext = path.extname(file.originalname); // .jpg, .png 등 확장자 추출
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    // 예: my_image.jpg -> my_image1678888888888.jpg
  }
});


const upload = multer({
  storage: storage,
  limits: {fileSize:5* 1024*1024},
});

app.use(express.json());
app.use("/products", productRoutes);
app.use('/uploads', express.static('uploads'));
//app.use("/articles", articleRoutes);

app.get("/", (req, res) => {
  res.send("중고마켓 API 서버가 정상 실행 중입니다. /products 엔드포인트를 사용하세요.");
});

app.post("/images", upload.single('images'), (req,res) => {
  console.log('이미지:', req.file);
  res.json({ "image":req.file.filename });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});