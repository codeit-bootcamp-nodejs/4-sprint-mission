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
        return res.status(400).send("400 bad request");
    }
}


export function ArticleValid(req,res,next){
    // console.log('articlevalid first')
    const {title, articleContent} = req.body;
    if (!title ||!articleContent){
        res.send("no title or articleContent");
    }

    if (title.length>50 ||articleContent.length>800 ){
        res.send("too long or too short");
    }

    next();

}

