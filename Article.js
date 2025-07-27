class Article {
  constructor(title,content,writer) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = 0;
    this.createdAt = new Date();
    }
  like() {
    this.likeCount+=1
    }
  get title() {
    return this._title;
  }
  set title(newTitle) {
    if (typeof newTitle === 'string' && newTitle.trim() !== '') {
      this._title = newTitle;
    } else {
      throw new Error('이름은 비어있을 수 없습니다.');
    }
  }

  get content() {
    return this._content; 
  }

  get writer() {
    return this._writer;
  }
  }


