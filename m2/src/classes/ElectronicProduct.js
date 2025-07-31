import { Product } from "./Product.js";

export class ElectronicProduct extends Product {
    #manufacturer;

    constructor({
        name,
        description,
        price,
        tags,
        images,
        favoriteCount,
        manufacturer,
    }) {
        super({ name, description, price, tags, images, favoriteCount });
        this.#manufacturer = manufacturer; // 제조사
    }

    get manufacturer() {
        return this.#manufacturer;
    }
}
