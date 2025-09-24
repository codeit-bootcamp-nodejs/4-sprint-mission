import ProductService from "../services/product/product.service.js";
import { Product } from "../classes/product.js";
import { ElectronicProduct } from "../classes/electronic_product.js";
import type { ProductData, ProductListQuery, ElectronicProductData } from "../services/product/product.dto.js";

const products: (Product | ElectronicProduct)[] = [];

async function loadProducts(query?: ProductListQuery): Promise<void> {
  try {
    const result = await ProductService.getProductList(query);
    const data = result.list;

    const electronicProducts = data
      .filter((ele: ElectronicProductData) => ele.tags.includes("전자제품"))
      .map(
        (ele: ElectronicProductData) =>
          new ElectronicProduct({
            manufacturer: ele.manufacturer || "Unknown",
            name: ele.name,
            description: ele.description || "No description",
            price: ele.price,
            tags: ele.tags,
            images: ele.images || [],
            favoriteCount: ele.favoriteCount || 0,
          })
      );

    const normalProducts = data
      .filter((ele: ProductData) => !ele.tags.includes("전자제품"))
      .map(
        (ele: ProductData) =>
          new Product(
            ele.name,
            ele.description || "No description",
            ele.price,
            ele.tags,
            ele.images || [],
            ele.favoriteCount || 0
          )
      );

    products.splice(0, products.length, ...electronicProducts, ...normalProducts);
  } catch (err) {
    console.log("[store error] 상품을 불러오지 못했습니다.");
    throw err;
  }
}
