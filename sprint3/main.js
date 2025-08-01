import ArticleRouter  from "./ArticleApi.js";
import ProductRouter from "./ProductApi.js";
import express from 'express';
import prisma from '@prisma/client'

const app = express();

app.use('/article', ArticleRouter);
app.use('/product', ProductRouter);




app.listen(3000, () =>{
    console.log("server is running at http://localhos:3000")
})