export class Article {
  constructor(title, content, writer, likeCount = 0) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = likeCount;
  }
  like() {
    return this.like++;
  }
}
