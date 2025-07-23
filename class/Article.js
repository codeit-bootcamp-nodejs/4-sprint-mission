// models/Article.js/
// content.js에서 온 자료들을 상속
import Content from './1.Content.js';

export default class Article extends Content {
  constructor(title, content, writer) {
    super();
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.createdAt = new Date(); // 생성 시점 시간 저장
  }

  like() {
    this.favorite(); // 다형성 활용
  }

  get likeCount() {
    return this.favoriteCount;
  }
}
