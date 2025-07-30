import axios from "axios";
import { Product, ElectronicProduct } from "../Model/Product.js";

const BASE_URL = "https://panda-market-api-crud.vercel.app/products";

// Product 상품 목록을 검색하는 함수
export async function getProductList(page = 1, pageSize = 10, keyword = "") {
  const url = new URL(BASE_URL);
  url.searchParams.append("page", page);
  url.searchParams.append("pageSize", pageSize);

  if (typeof keyword === "string" && keyword.trim()) {
    url.searchParams.append("keyword", keyword.trim());
  }

  console.log(url.toString());

  try {
    const res = await axios.get(url.toString());
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(error.message);
  }
}

// Product ID의 상세정보를 조회하는 함수
export async function getProduct(id) {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(error.message);
  }
}

// Proudct 새로운 상품을 추가하는 함수
export async function createProduct({
  name,
  description,
  price,
  tags,
  images,
}) {
  console.log("입력", { name, description, price, tags, images });
  try {
    const requestBody = { name, description, price, tags, images };

    const res = await axios.post(BASE_URL, requestBody);
    console.log("성공", res.data);
    return res.data;
  } catch (error) {
    console.error(error.message);
  }
}

// Product ID의 정보를 변경하는 함수
export async function patchProduct(id, update) {
  console.log("업데이트", update);
  try {
    const res = await axios.patch(`${BASE_URL}/${id}`, update);
    console.log("업데이트 성공", res.data);
    return res.data;
  } catch (error) {
    console.error(error.message);
  }
}

// Product ID를 삭제하는 함수
export async function deleteProduct(id) {
  console.log("삭제할 ID :", id);
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    console.log(`ID : ${id} 삭제 성공`);
    return res.data;
  } catch (error) {
    console.error(error.message);
  }
}

//검색한 상품 목록을 class로 생성하는 함수
export async function loadProducts(page, pageSize, keyword) {
  try {
    const response = await getProductList(page, pageSize, keyword);
    const productList = response.list;

    if (!Array.isArray(productList)) {
      console.error("response는 배열이 아닙니다.", response);
      return;
    }

    const products = productList.map((item) => {
      if (item.tags.includes("전자제품")) {
        return new ElectronicProduct(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images,
          item.manufacturer,
          item.favoriteCount
        );
      } else {
        return new Product(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images,
          item.favoriteCount
        );
      }
    });

    console.log(products);
  } catch (error) {
    console.error(error.message);
  }
}
