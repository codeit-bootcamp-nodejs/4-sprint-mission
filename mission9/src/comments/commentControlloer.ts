import { Request, Response } from "express";
import { commentService } from "./commentService";





///////////////////////////////////////////////////////////////
//자신이 작성한 게시글에 댓글이 달렸을 때 알림을 보내주세요.

export async function createComment(req: Request, res: Response) {
    try {
        const userId = req.user.id
        const { postId, content } = req.body;
        const result = await commentService.createComment(userId, postId, content);
        res.status(201).json({
            message: "댓글이 성공적으로 등록되었습니다.",
            result,
        });
    } catch (error) {
        console.error("createComment Error", error);
        res.status(500).json({ Message: "댓글 등록 실패"})
    }
}