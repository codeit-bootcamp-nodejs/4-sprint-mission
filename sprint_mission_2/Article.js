// Article.js
export class Article {
  #likeCount;

  constructor(title, content, writer, likeCount = 0) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.#likeCount = likeCount;
    this.createdAt = new Date();
  }

  like() {
    this.#likeCount++;
  }

  get likeCount() {
    return this.#likeCount;
  }

  set likeCount(value) {
    if (value < 0) {
      throw new Error('Count cannot be negative');
    }
    this.#likeCount = value;
  }
}
