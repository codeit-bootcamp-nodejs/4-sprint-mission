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



