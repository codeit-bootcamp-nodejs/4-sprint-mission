import express from 'express';
import multer from "multer";

const router = express.Router();

const upload = multer({ dest: 'uploads/' });


router.post('/', upload.single('image'), async (req, res) => {
    // console.log(req.file);
    res.status(201).json({ message: 'Upload OK', filePath: req.file.path });
});


export default router;