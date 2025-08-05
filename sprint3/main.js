import ArticleRouter  from "./ArticleApi.js";
import ProductRouter from "./ProductApi.js";
// import fileRouter from "./file.js";

import express from 'express';
import prisma from '@prisma/client';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client'


const app = express();

app.use(express.json());
app.use('/article', ArticleRouter);
app.use('/product', ProductRouter);
// app.use('/upload', fileRouter);

console.log(process.env.DATABASE_URL);

app.listen(3000, () =>{
    console.log("server is running at http://localhost:3000")
})