import { commentRepository } from "./commentRepository";
import { io } from "../socket/socket";

export const commentService = {
    async createComment(userId: number, postId: number, content: string) {

        //댓글저장
        const comment = await commentRepository.createComment(userId, postId, content);

        // 2️⃣ 해당 게시글의 작성자 찾기
        const post = await commentRepository.findAllByUserId(postId);

        // 자기 자신이 자기 글에 단 댓글은 알림 안 보내도록 처리
        if (post && post.userId !== userId) {


            // 3️⃣ 알림 메시지 생성
            const message = `당신의 게시글 "${post.title}"에 새 댓글이 달렸습니다.`;

            // 4️⃣ Socket.IO를 이용해 게시글 작성자에게 알림 전송
            io.to(`user-${post.userId}`).emit("new-notification", { message });
        }
        return comment;
    },
};