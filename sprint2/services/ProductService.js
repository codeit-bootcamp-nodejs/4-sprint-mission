// services/ProductService.js
import axiosInstance from '../api/axiosInstance.js';
import Product from '../class/Product.js';
import ElectronicProduct from '../class/ElectronicProduct.js';

export async function getProductList({ page = 1, pageSize = 10, keyword = '' }) {
  try {
    const response = await axiosInstance.get('/products', {
      params: { page, pageSize, keyword }
    });

    const productData = response.data;
    const products = productData.map(product => {
      const { name, description, price, tags, images } = product;
      if (tags.includes('전자제품')) {
        return new ElectronicProduct(name, description, price, tags, images);
      } else {
        return new Product(name, description, price, tags, images);
      }
    });

    return products;
  } catch (error) {
    console.error('상품 목록 요청 실패:', error.response?.data || error.message);
    return [];
  }
}

export async function getProduct(productId) {
  try {
    const res = await axiosInstance.get(`/products/${productId}`);
    return res.data;
  } catch (err) {
    console.error('상품 조회 실패:', err.response?.data || err.message);
  }
}

export async function createProduct({ name, description, price, tags, images }) {
  try {
    const res = await axiosInstance.post('/products', {
      name,
      description,
      price,
      tags,
      images
    });
    return res.data;
  } catch (err) {
    console.error('상품 생성 실패:', err.response?.data || err.message);
  }
}

export async function patchProduct(productId, { name, description, price, tags, images }) {
  try {
    const res = await axiosInstance.patch(`/products/${productId}`, {
      name,
      description,
      price,
      tags,
      images
    });
    return res.data;
  } catch (err) {
    console.error('상품 수정 실패:', err.response?.data || err.message);
  }
}

export async function deleteProduct(productId) {
  try {
    const res = await axiosInstance.delete(`/products/${productId}`);
    return res.data;
  } catch (err) {
    console.error('상품 삭제 실패:', err.response?.data || err.message);
  }
}
