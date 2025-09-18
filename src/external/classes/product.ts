export class Product {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  favoriteCount: number;

  constructor(
    name: string,
    description: string,
    price: number,
    tags: string[],
    images: string[],
    favoriteCount: number
  ) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount;
  }

  favorite() {
    this.favoriteCount += 1;
  }
}
