class Article {
    constructor(title, content, writer, likeCount ) {
        this.title = title;
        this.content = content;
        this.writer = writer;
        this.likeCount = likeCount;
        this.createdAt = new Date();
    }

    like() {
        likeCount ++;
    }
}
