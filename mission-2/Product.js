export default class Product {
    name;
    price;
    tags;
    images;
    favoriteCount;
    description;
    constructor({ name = 'default', description = 'default', price = 'default', tags = 'default', images = 'default', favoriteCount = 'default' }) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.tags = tags;
        this.images = images;
        this.favoriteCount = favoriteCount;
    }
    // getter, setter
    getName() { return this.name; }
    getPrice() { return this.price; }
    getTags() { return this.tags; }
    getImages() { return this.images; }
    getFavoriteCount() { return this.favoriteCount; }
    getDescription() { return this.description; }
    setName(name) { this.name = name; }
    setPrice(price) { this.price = price; }
    setTags(tags) { this.tags = tags; }
    setImages(images) { this.images = images; }
    setFavoriteCount(favoriteCount) { this.favoriteCount = favoriteCount; }
    setDescription(description) { this.description = description; }

    favorite() {
        this.favoriteCount++;
    }
}
