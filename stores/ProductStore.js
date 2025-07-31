import ProductService from "../services/ProductService.js";
import { Product } from "../classes/Product.js";
import { ElectronicProduct } from "../classes/ElectronicProduct.js";

const products = [];

// const result = await ProductService.getProductList();
// const data = result.list;
// console.log(data);

async function loadProducts(query) {
  try {
    const result = await ProductService.getProductList(query);
    const data = result.list;

    const electronicProducts = data
      .filter((ele) => ele.tags.includes("전자제품"))
      .map((ele) => new ElectronicProduct(ele));

    const normalProducts = data
      .filter((ele) => !ele.tags.includes("전자제품"))
      .map((ele) => new Product(ele));

    products.splice(0, products.length, ...electronicProducts, normalProducts);

    // for (let ele of data) {
    //   const isElectronic = ele.tags.includes("전자제품");
    //   let product;
    //   if (isElectronic) {
    //     product = new ElectronicProduct(ele);
    //   } else {
    //     product = new Product(ele);
    //   }

    //   products.push(product);
    // }
  } catch (err) {
    console.log("[store error] 상품을 불러오지 못했습니다.");
    throw err;
  }
}
