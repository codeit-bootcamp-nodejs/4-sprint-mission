import { Product } from "./Product.js";

export class ElectronicProduct extends Product {
  constructor({ manufacturer, ...rest }) {
    super(rest);
    this.manufacturer = manufacturer;
  }
}
