import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { s3 } from "../lib/aws.js";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "../image/");
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 },
// });
const upload = multer({
  storage: multerS3({
    s3: s3 as any,
    bucket: "codeit-practice-s3",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const date = Date.now();
      const filename = `${date}_${file.originalname}`;
      cb(null, `uploads/${filename}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;
