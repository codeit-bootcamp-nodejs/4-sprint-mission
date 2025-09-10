import articleRouter from "./router/article-router.js";
import productRouter from "./router/product-router.js";
import userRouter from "./router/user-router.js";
import fileRouter from "./file.js";

import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import passport from "passport";


const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
passport.use('AccessToken', accessJwtStrategy)
passport.use('RefreshToken', refreshJwtStrategy)



app.use('/user', userRouter);
app.use('/article', articleRouter);
app.use('/product', productRouter);
app.use('/upload',fileRouter);

app.use((err, req, res, next) =>{
    if (err){
        res.json( err.message|| "Server Error Occured");
    }
})

app.listen(3000, () =>{
    console.log("server is running at http://localhost:3000")
})