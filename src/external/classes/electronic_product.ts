import { Product } from "./product.js";

export class ElectronicProduct extends Product {
  manufacturer: string;

  constructor({
    manufacturer,
    name,
    description,
    price,
    tags,
    images,
    favoriteCount,
  }: {
    manufacturer: string;
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
    favoriteCount: number;
  }) {
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer;
  }
}
