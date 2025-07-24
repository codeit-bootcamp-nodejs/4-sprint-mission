// Article 클래스는 게시글 작성과 좋아요 기능을 구현한다.
export class Article {
  constructor(title, content, writer) {
    this._title = title;
    this._content = content;
    this._writer = writer;
    this._likeCount = 0;
    this._createdAt = new Date();
  }

  set title(value) {
    this._title = value;
  }
  get title() {
    return this._title;
  }

  set content(value) {
    this._content = value;
  }
  get content() {
    return this._content;
  }

  set writer(value) {
    this._writer = value;
  }
  get writer() {
    return this._writer;
  }

  set likeCount(value) {
    this._likeCount = value;
  }
  get likeCount() {
    return this._likeCount;
  }

  get createdAt() {
    return this._createdAt;
  }

  like () {
    this._likeCount++;
  }
}