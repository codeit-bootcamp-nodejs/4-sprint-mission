class Article {
  title: string;
  content: string;
  writer: string;
  likeCount: number;
  createdAt: number;

  constructor(title: string, content: string, writer: string, likeCount: number) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = likeCount;
    this.createdAt = Date.now();
  }

  like() {
    this.likeCount += 1;
  }
}
