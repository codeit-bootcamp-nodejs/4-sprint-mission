export class Article {
    constructor(title, content, writer, likeCount ) {
        this._title = title;
        this._content = content;
        this._writer = writer;
        this._likeCount = likeCount;
        this._createdAt = new Date();
    }

    set title(input) {
        this._title = input;
    }

    set content(input) {
        this._content = input;
    }

    set writer(input) {
        this._writer = input;
    }

    set likeCount(input) {
        this._likeCount = input;
    }

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

    like() {
        this._likeCount ++;
    }
}
