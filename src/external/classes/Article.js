class Article {
  constructor(title, content, writer, likeCount) {
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
