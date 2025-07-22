class Product {
  constructor(name, description, price, tags, images, favoriteCount) {
  this.name = name;
  this.description = description;
  this.price = price;
  this.tags = tags;
  this.images = images;
  this.favoriteCount = favoriteCount
  }

  favorite() {
    favoriteCount ++;
  }
}

class ElectronicProduct extends Product{
  constructor(name, description, price, tags, images, favoriteCount, manufacturer) {
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer;
  }
}

import { getProductList, getProduct, createProduct, patchProduct } from "./ProductService.js";

function addNewProduct(products) {
  const { name, description, price, tags, images, favoriteCount } = product;
  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price,
    tags,
    images,
    favoriteCount,
  };
  productsInput.push(newProduct);
}

const productsInput = await getProduct();

console.log(productsInput);

const products = productsInput;

console.log(products);

const electronicProduct = [];

// productsInput.list.forEach((product) => {
//   if(product.tags.find((element) => element === '전자제품')) {
//     electronicProduct.push(product);
//   }
// });

// console.log(electronicProduct);

productsInput.list.forEach((product) => {
  if(product.tags.includes('전자제품')) {
    electronicProduct.push(product);
  }
});

console.log(electronicProduct);