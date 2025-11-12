export class CommentCreatedEvent {
  constructor(
    public readonly commentId: number,
    public readonly productId: number,
    public readonly userId: number, // 댓글 작성자
    public readonly content: string,
    public readonly createdAt: Date = new Date(),
  ) {}
}

export class Comment {
  private domainEvents: any[] = [];

  constructor(
    public readonly id: number,
    public readonly productId: number,
    public readonly userId: number,
    public content: string,
    public readonly createdAt: Date,
  ) {}

  static create(productId: number, userId: number, content: string): Comment {
    const comment = new Comment(0, productId, userId, content, new Date());
    comment.domainEvents.push(new CommentCreatedEvent(0, productId, userId, content));
    return comment;
  }

  getDomainEvents() {
    return [...this.domainEvents];
  }

  clearDomainEvents() {
    this.domainEvents = [];
  }
}
