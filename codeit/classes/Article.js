class Article {
    constructor(title, content, writer, likeCount) {
        this.title = title;
        this.content = content;
        this.writer = writer;
        this.likeCount = likeCount;
        this.createdAt = new Date();  // 생성 시점의 시간 저장
    }

    like() {
        return this.likeCount += 1;
    }
}
