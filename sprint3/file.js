import express from 'express';
import multer from 'multer';

const app = express();
const fileRouter = express.Router();


const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null, '/UploadedFile')
    },
    filename: function(req,res,cb){
        cb(null, file.filename + '-' + Date.now())
    }
})

const upload = multer({ storage: storage})

fileRouter.get('',(req,res) =>{
    res.stataus(300).send("file upload site");
})

fileRouter.post('/upload', upload.single('FormName'), (req,res) =>{
    res.send(`${file.path}`);
});

export default fileRouter;