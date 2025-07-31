export class Product {
    #name;
    #description;
    #price;
    #tags;
    #images;
    #favoriteCount;

    constructor({name, description, price, tags = [], images = [], favoriteCount = 0}) {
        this.#name = name; // 상품명
        this.#description = description; // 상품 설명
        this.#price = price; // 판매 가격
        this.#tags = tags; // 해시태그 배열
        this.#images = images; // 이미지 배열
        this.#favoriteCount = favoriteCount; // 찜하기 수
    }

    get name() {
        return this.#name;
    }

    get description() {
        return this.#description;
    }
    
    get price() {
        return this.#price;
    }

    get tags() {
        return [...this.#tags];
    }

    get images() {
        return [...this.#images];
    }

    get favoriteCount() {
        return this.#favoriteCount;
    }

    set price(newPrice) {
        if(newPrice >= 0) {
            this.#price = newPrice;
        } else {
            console.log("가격은 0보다 작을 수 없습니다.");
        }
    }

    favorite() {
        this.#favoriteCount += 1;
    }
}
