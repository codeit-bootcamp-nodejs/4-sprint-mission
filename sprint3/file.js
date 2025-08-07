import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();
const fileRouter = express.Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, 'UploadedFile');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null, uploadPath)
    },
    filename: function(req,file,cb){
        cb(null, file.originalname + '-' + Date.now())
    }
})

const upload = multer({ storage: storage})

fileRouter.get('',(req,res,next) =>{
    try{
        return res.status(200).send("file upload site");
    }catch(error){
        console.error(error);
        return next(error);
    }
})

fileRouter.post('/upload', upload.single('FormName'), (req,res,next) =>{
    try{
        if (!req.file){
            return res.status(400).json({error: "no file uploaded"});
        }
        return res.send(`${req.file.path}`);
    } catch(error){
        console.error(error);
        return next(error);
    }
    
});

export default fileRouter;
