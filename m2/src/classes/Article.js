export class Article {
    #title;
    #content;
    #writer;
    #likeCount;
    #createdAt;

    constructor({ title, content, writer, likeCount = 0 }) {
        this.#title = title;
        this.#content = content;
        this.#writer = writer;
        this.#likeCount = likeCount;
        this.#createdAt = new Date().toISOString(); // 생성 시점 저장
    }

    get title() {
        return this.#title;
    }

    get content() {
        return this.#content;
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

    like() {
        this.#likeCount += 1;
    }
}
