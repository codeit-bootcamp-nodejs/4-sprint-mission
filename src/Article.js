export class Article {
  #title;
  #content;
  #writer;
  #likeCount;
  #createdAt;

  constructor(title, content, writer) {
    this.#title = title;
    this.#content = content;
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

  get content() {
    return this.#content;
  }
  set content(val) {
    this.#content = val;
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
