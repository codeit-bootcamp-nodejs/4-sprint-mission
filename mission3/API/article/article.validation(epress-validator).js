/*
import{ query, validationResult } from'express-validator';
import { findUniqueArticle } from './article.service';

export const validatePagination = [
    query('page')
    .optional() // 없어도 통과
    .isInt({ min : 1 }) // 단 음수면 백


    .withMessage('page는 1보다 커야 합니다'),
    (req, res, next) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({errors:errors.array() });
        
        next();
    }
];

export const validateSort = [
    query('sort')
        .optional() // sort값이 필요가 없지만 혹시 있으면
        .equals('latest') // 검증
        .withMessage('sort 값은 "latest" 여야 합니다'),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
            
            next();
        }
];

export const validateUniqueArticle = async(req, res, next)=>{

    const id = Number(req.params.id); // validation idx type check
    const uniqueArticle = await findUniqueArticle(id);

    if(!uniqueArticle) return res.status(404).json({error:"Not found"});

    req.article = uniqueArticle;
    next();
}

export const validateModifiedArticle = async(req, res, next ) =>{

    const id = Number(req.params.id);
    const { title, content } = req.body;
    const uniqueArticle = await findUniqueArticle(id); // retrive data from uniqueArticle fucntion 

    if (isNaN(id)) return res.status(400).json({error:"Invalid Id"});// validation for index type

    // validation for title and content, Aritcle
    if(!title || typeof title !== String) return res.status(400).json({error: "Invalid title"});
    if (!content) return res.status(400).json({error: "Invalid content"});
    if(!uniqueArticle) return res.status(404).json({error:"Not found"});

    req.article = uniqueArticle; // attach unique article to request
    next();// go to next 
}

export const validateDeletedArticle = async (req, res, next) => {
    const id = Number(req.params.id); 
    const uniqueArticle = await findUniqueArticle(id);
    
    if(isNaN(id)) return res.status(400).json({error:"Invalid Id"});// index type check
    if(!uniqueArticle){// validation for the post 
        return res.status(404).json({error : "Not found for Article."});
    }

    req.article = uniqueArticle ;// attach unique article to request
    next();
}
*/