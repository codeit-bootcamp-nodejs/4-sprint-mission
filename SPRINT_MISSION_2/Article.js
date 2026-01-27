export class Article {
  #title;
  #article;
  #writer;
  #likeCount;
  #createdAt;

  constructor(title, article, writer) {
    this.#title = title;
    this.#article = article;
    this.#writer = writer;
    this.#likeCount = 0;
    this.#createdAt = new Date();
  }

  like() {
    this.#likeCount++;
  }

  get title() {
    return this.#title;
  }
  set title(val) {
    this.#title = val;
  }

  get article() {
    return this.#article;
  }
  set article(val) {
    this.#article = val;
  }

  get writer() {
    return this.#writer;
  }

  get likeCount() {
    return this.#likeCount;
  }

  get createdAt() {
    return this.#createdAt;
  }
}
