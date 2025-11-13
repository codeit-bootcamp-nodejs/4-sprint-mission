import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { eventBus } from '../../utils/event-bus.js';
import { HttpException } from '../../utils/http-exception.js';
import { postRepository } from '../post/post.repository.js';
import { Comment } from './comment.js';
import { commentRepository } from './comment.repository.js';
import type { CreateCommentInput } from './comment.type.js';

class CommentService {
  create = async (createCommentData: CreateCommentInput) => {
    const post = await postRepository.findById(createCommentData.postId);

    if (!post || post.userId == null) {
      throw new HttpException(STATUS_CODE.NOT_FOUND, MESSAGE.postNotFound);
    }

    // Comment 엔티티 생성
    const comment = Comment.create(createCommentData);
    // DB에 저장
    const savedComment = await commentRepository.create(createCommentData);

    // 이벤트 생성
    comment.addCreatedEvent(savedComment.id);

    // 이벤트 발행
    const events = comment.getDomainEvents();
    events.forEach((event) => {
      eventBus.publish(event);
    });

    // 이벤트 정리
    comment.clearDomainEvents();

    return savedComment;
  };
}
export const commentService = new CommentService();
