import multer from "multer";
import express from 'express';


export function ProductValid(req,res,next){
    const {name,description, price, tags} = req.body;
    try{
        if (typeof(name) =='undefined' || typeof(description) =='undefined'||
            typeof(price) == 'undefined' || typeof(tags)=='undefined'){
                throw Error;
        }else{
            next();
        }
    } catch(error){
        res.status(400).send("400 bad request");
    }
}


export function ArticleValid(req,res,next){
    try {
        const {title, content} = req.body;
        if (title == 'undefined' || title =='null' ||
            content == "undefined"|| content =='null'
        ){
            throw Error;
        }else{
            next();
        }
    } catch(error){
        res.status(400).send("400 bad request")
    }

    try{
        if (title.length>20 ||content.length>800 ){
            throw Error;
        }
    }catch(error){
        res.status(400).send("title or content is too long")
    }
}


// 일단 multer 사용법
const app = express();


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now()+ '-'+ file.originalname)
    }
});
const upload = multer({ storage: storage})

app.post('/upload', multer.single('myFile'), (req,res) =>{
    console.log(req.file);
    res.send("파일 업로드 완료!");
});




