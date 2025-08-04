
export default class Article {
    title;
    content;
    writer;
    #likeCount;
    #createdAt;
    constructor({ title = 'default', content = 'default', writer = 'default', likeCount = 0 }) {
        this.title = title;
        this.content = content;
        this.writer = writer;
        this.likeCount = likeCount;
        this.createdAt = new Date();
    }
    // getter, setter
    getTitle() { return this.title; }
    getContent() { return this.content; }
    getWriter() { return this.writer; }
    getLikeCount() { return this.likeCount; }
    setTitle(title) { this.title = title; }
    setContent(content) { this.content = content; }
    setWriter(writer) { this.writer = writer; }
    setLikeCount(likeCount) { this.likeCount = likeCount; }

    like() {
        this.#likeCount++;
    }
}
