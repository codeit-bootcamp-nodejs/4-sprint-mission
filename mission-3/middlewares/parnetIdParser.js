import { idValidator } from "../validators/struct.js";
import { create } from "superstruct";

export default function parentIdParser(req, res, next){
    const url = req.baseUrl;
    const {id} = create(req.params, idValidator);
    req.parentId = id;
    
    if(url.startsWith('/product')){
        req.parentType = 'product';
    }else if(url.startsWith('/article')){
        req.parentType = 'article';
    }else{
        return res.status(400).json({error: '올바르지 않은 부모 타입입니다.'})
    }
    next();
}
