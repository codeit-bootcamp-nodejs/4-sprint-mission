
import type { Request, Response, NextFunction } from 'express';

export async function ValidCommentForm(req: Request,res: Response,next: NextFunction){
    const id = Number(req.params.id) ;
    const CommentId= Number(req.params.commentId);
    
    const commentContent = req.body.commentContent;
        if (!commentContent|| commentContent.length>500){
            next(new Error("invalid body"))
        }
    next()
}

export default ValidCommentForm;