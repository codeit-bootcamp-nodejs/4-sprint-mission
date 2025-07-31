import Product from './Product.js';

export default class ElectronicProduct extends Product {
    #manufacturer;
    constructor({ name, description, price, tags, images, favoriteCount, manufacturer = 'default' }) {
        super(name, description, price, tags, images, favoriteCount);
        this.#manufacturer = manufacturer;
    }
    getManufacturer() { return this.#manufacturer; }
    setManufacturer() { this.#manufacturer = manufacturer; }
}
