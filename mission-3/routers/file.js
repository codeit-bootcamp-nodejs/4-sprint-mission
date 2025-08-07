import express from 'express';
import multer from 'multer';
import fs from 'fs';
import errorHandler from '../middlewares/routerErrorHandler';

const fileRouter = express.Router();
const upload = multer({dest: 'uploads/'})

fileRouter.route('/')
    .post(upload.single('image'), errorHandler((req, res)=>{
        const mim = req.file.mimetype;
        let type = '';
        if(mim.includes('jpg')){
            type = '.jpg';
        }else if(mim.includes('png')){
            type = '.png';
        }
        const path = `uploads/${req.file.filename}${type}`;
        fs.renameSync(req.file.path, path)
        res.status(201).json({path})
    }))

export default fileRouter;
