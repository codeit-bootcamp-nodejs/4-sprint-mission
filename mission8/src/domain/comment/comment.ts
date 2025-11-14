import type { CreateCommentInput } from './comment.type.js';

interface CommentCreatedEventData {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: Date;
}

export class CommentCreatedEvent {
  constructor(public readonly eventData: CommentCreatedEventData) {}
}

export class Comment {
  private domainEvents: CommentCreatedEvent[] = [];

  constructor(
    public readonly id: number,
    public readonly postId: number,
    public readonly userId: number,
    public content: string,
    public readonly createdAt: Date,
  ) {}

  static create(createData: CreateCommentInput): Comment {
    const { postId, userId, content } = createData;
    const comment = new Comment(0, postId, userId, content, new Date());
    return comment;
  }

  addCreatedEvent(id: number) {
    const eventData = {
      id,
      postId: this.postId,
      userId: this.userId,
      content: this.content,
      createdAt: this.createdAt,
    };
    this.domainEvents.push(new CommentCreatedEvent(eventData));
  }

  getDomainEvents() {
    return [...this.domainEvents];
  }

  clearDomainEvents() {
    this.domainEvents = [];
  }
}
