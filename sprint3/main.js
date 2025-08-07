import ArticleRouter  from "./ArticleApi.js";
import ProductRouter from "./ProductApi.js";
import fileRouter from "./file.js";

import express from 'express';
import 'dotenv/config';


const app = express();

app.use(express.json());
app.use('/article', ArticleRouter);
app.use('/product', ProductRouter);
app.use('/upload',fileRouter);
app.use( (err,req,res,next) =>{
    if (err){
        res.json( err.message|| "Server Error Occured");
    }
})



app.listen(3000, () =>{
    console.log("server is running at http://localhost:3000")
})