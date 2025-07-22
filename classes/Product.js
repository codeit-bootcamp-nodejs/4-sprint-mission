export class Product {
  constructor({ name, description, price, tags, images, favortieCount }) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favortieCount = favortieCount;
  }

  favortie() {
    this.favortieCount += 1;
  }
}
