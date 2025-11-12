import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { eventBus } from '../../utils/event-bus.js';
import { HttpException } from '../../utils/exception.js';
import { postRepository } from '../post/post.repository.js';
import { Comment, CommentCreatedEvent } from './comment.js';
import { commentRepository } from './comment.repository.js';
import type { CreateComment } from './comment.type.js';

class CommentService {
  create = async (data: CreateComment) => {
    const post = await postRepository.findById(data.postId);

    if (!post || post.userId == null) {
      throw new HttpException(STATUS_CODE.NOT_FOUND, MESSAGE.postNotFound);
    }

    const comment = Comment.create(data.postId, data.userId, data.content);
    const savedComment = await commentRepository.create(data.content, data.userId, data.postId);

    const events = comment.getDomainEvents();
    events.forEach((event) => {
      if (event instanceof CommentCreatedEvent) {
        eventBus.publish(
          new CommentCreatedEvent(savedComment.id, event.productId, event.userId, event.content, event.createdAt),
        );
      }
    });

    return savedComment;
  };
}
export const commentService = new CommentService();
