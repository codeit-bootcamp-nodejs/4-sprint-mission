import { localUpload } from "./local.js";
import { s3upload } from "./s3.js";

const upload = process.env.NODE_ENV === "production" ? s3upload : localUpload;

export default upload;
