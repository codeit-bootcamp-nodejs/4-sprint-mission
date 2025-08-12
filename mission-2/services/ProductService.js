import axios from 'axios';
import { PRODUCT_BASE_URL as BASE_URL } from '../constants/api.js'; // 변경

// 상품 리스트 조회 (async/await)
export async function getProductList(page = 1, pageSize = 10, keyword = '') {
  try {
    const res = await axios.get(BASE_URL, {
      params: { page, pageSize, keyword },
    });
    return res.data;
  } catch (err) {
    console.error('getProductList 오류:', err.message);
    return [];
  }
}

// 상품 단건 조회
export async function getProduct(id) {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error('getProduct 오류:', err.message);
    return null; // 오류 발생 시 null 반환
  }
}

// 상품 생성
export async function createProduct(productData) {
  try {
    const res = await axios.post(BASE_URL, productData);
    return res.data;
  } catch (err) {
    console.error('createProduct 오류:', err.message);
  }
}

// 상품 수정
export async function patchProduct(id, productData) {
  try {
    const res = await axios.patch(`${BASE_URL}/${id}`, productData);
    return res.data;
  } catch (err) {
    console.error('patchProduct 오류:', err.message);
  }
}

// 상품 삭제
export async function deleteProduct(id) {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error('deleteProduct 오류:', err.message);
  }
}
