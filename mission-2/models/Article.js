export class Article {
  constructor(title, content, writer, likeCount = 0) {
    this._title = title;
    this._content = content;
    this._writer = writer;
    if (typeof likeCount === 'number' && likeCount >= 0) {
      this._likeCount = likeCount;
    } else {
      throw new Error('좋아요 수는 0 이상의 숫자여야 합니다.');
    }
    this._createdAt = new Date();
  }

  // getter 메서드들
  get title() {
    return this._title;
  }

  get content() {
    return this._content;
  }

  get writer() {
    return this._writer;
  }

  get likeCount() {
    return this._likeCount;
  }

  get createdAt() {
    return this._createdAt;
  }

  // setter 메서드들
  set title(value) {
    if (typeof value === 'string' && value.length > 0) {
      this._title = value;
    } else {
      throw new Error('제목은 비어있지 않은 문자열이어야 합니다.');
    }
  }

  set content(value) {
    if (typeof value === 'string') {
      this._content = value;
    } else {
      throw new Error('내용은 문자열이어야 합니다.');
    }
  }

  set writer(value) {
    if (typeof value === 'string' && value.length > 0) {
      this._writer = value;
    } else {
      throw new Error('작성자는 비어있지 않은 문자열이어야 합니다.');
    }
  }

  // likeCount는 직접 설정할 수 없고, like() 메서드를 통해서만 증가
  like() {
    this._likeCount++;
  }
}
