import express from 'express';
import multer from 'multer';

// const app = express();
// const fileRouter = express.Router();

// const storage = multer.diskStorage({
//         destination: function(req, file, cb){
//             cb(null, 'uploads/');
//         },
//         filename: function(req, file, cb){
//             cb(null, Date.now()+ '-'+ file.originalname)
//         }
// });

// fileRouter.post('', multer.single('myFile'), (req,res) =>{

    
    
//     const upload = multer({ storage: storage})

    
//     console.log(req.file);
//     res.send(`${uploads}/${res.file.filename}`);
// });

// export default fileRouter;