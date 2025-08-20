import { assert, StructError } from 'superstruct'
import { CreateArticle, CreateComment, CreateProduct, PatchArticle, PatchComment, PatchProduct } from "../struct.js"

export function createArticleValidator (req, res, next){
  try{
    assert(req.body, CreateArticle);
    next();
  } catch(err){
    next(err); 
  }
}

export function patchArticleValidator (req, res, next){
  try{
    assert(req.body, PatchArticle);
    next();
  } catch(err){
    next(err); 
  }
}

export function createProductValidator (req, res, next){
  try{
    assert(req.body, CreateProduct);
    next();
  } catch(err){
    next(err); 
  }
}

export function patchProductValidator (req, res, next){
  try{
    assert(req.body, PatchProduct);
    next();
  } catch(err){
    next(err); 
  }
}

export function createCommentValidator (req, res, next){
  try{
    assert(req.body, CreateComment);
    next();
  } catch(err){
    next(err); 
  }
}

export function patchCommentValidator (req, res, next){
  try{
    assert(req.body, PatchComment);
    next();
  } catch(err){
    next(err); 
  }
}