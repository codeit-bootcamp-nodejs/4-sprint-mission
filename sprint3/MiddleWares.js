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
    try {
        const {title, content} = req.body;
        if (title == 'undefined' || title =='null' ||
            content == "undefined"|| content =='null'
        ){
            throw new Error;
        }else{
            // console.log('articlevalid second')
        }
    } catch(error){
        return res.status(400).send("400 bad request")
    }

    try{
        // console.log('articlevalid 3')
        if (title.length>50 ||content.length>800 ){
            throw Error;
        }
        next()
    }catch(error){
        // console.log('articlevalid 4')
        return res.status(400).send(`
            
            `)
    }
}

