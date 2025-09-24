import axios, { type AxiosResponse } from "axios";
import type { CreateProductDto, PatchProductDto, ProductListQuery, ProductListResponse } from "./product.dto.js";

const BASE_URL = "https://panda-market-api-crud.vercel.app/products";

const ProductService = {
  // 상품 리스트 조회
  async getProductList(query?: ProductListQuery): Promise<ProductListResponse> {
    const url = new URL(BASE_URL);

    for (let key in query) {
      if (query[key] !== undefined) {
        url.searchParams.append(key, query[key]);
      }
    }

    try {
      const res = await axios.get(url.toString());
      const data = await res.data;
      return data;
    } catch (err) {
      console.log(`[error] error가 발생했습니다.`);
      throw err.response.data;
    }
  },

  // 개별 상품 조회
  async getProduct(id: string) {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`);
      const data = await res.data;
      return data;
    } catch (err) {
      console.log(`[error] error가 발생했습니다.`);
      throw err.response.data;
    }
  },

  // 상품 등록
  async createProduct(productData: CreateProductDto) {
    try {
      const res = await axios.post(BASE_URL, productData);
      const data = await res.data;
      return data;
    } catch (err) {
      console.log(`[error] error가 발생했습니다.`);
      throw err.response.data;
    }
  },

  // 상품 정보 수정
  async patchProduct(id: string, productPatchData: PatchProductDto) {
    try {
      const res = await axios.patch(`${BASE_URL}/${id}`, productPatchData);
      const data = res.data;
      return data;
    } catch (err) {
      console.log(`[error] error가 발생했습니다.`);
      throw err.response.data;
    }
  },

  // 상품 삭제
  async deleteProduct(id: string) {
    try {
      const res = await axios.delete(`${BASE_URL}/${id}`);
      const data = res.data;
      return data;
    } catch (err) {
      console.log(`[error] error가 발생했습니다.`);
      throw err.response.data;
    }
  },
};

export default ProductService;
