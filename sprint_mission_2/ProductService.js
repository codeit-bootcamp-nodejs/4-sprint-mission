// ProductService.js
import axios from 'axios';
import { Product, ElectronicProduct } from './Product.js';

const BASE_URL = 'https://panda-market-api-crud.vercel.app/products';
export const products = [];

export async function getProductList(page = 1, pageSize = 10, keyword = '') {
  try {
    const res = await axios.get(BASE_URL, {
      params: { page, pageSize, keyword },
    });
    if (res.status >= 200 && res.status < 300) {
      const productArray = res.data.list;
      products.length = 0;

      productArray.forEach((item) => {
        const isElectronic = item.tags.includes('전자제품');
        const product = isElectronic
          ? new ElectronicProduct(item)
          : new Product(item);
        products.push(product);
      });
    } else {
      console.error(`failure on getProductList: ${res.status}`);
    }
  } catch (err) {
    console.error('failure on getProductList:', err.message);
  }
}

export async function getProduct(productId) {
  try {
    const res = await axios.get(`${BASE_URL}/${productId}`);
    return res.data;
  } catch (err) {
    console.error('failure on getProduct:', err.message);
  }
}

export async function createProduct({
  name,
  description,
  price,
  tags,
  images,
}) {
  try {
    const res = await axios.post(BASE_URL, {
      name,
      description,
      price,
      tags,
      images,
    });
    return res.data;
  } catch (err) {
    console.error('failure on createProduct:', err.message);
  }
}

export async function patchProduct(
  productId,
  { name, description, price, tags, images },
) {
  try {
    const res = await axios.patch(`${BASE_URL}/${productId}`, {
      name,
      description,
      price,
      tags,
      images,
    });

    if (res.status >= 200 && res.status < 300) {
      return res.data;
    } else {
      console.error(`failure on patchProduct: 상태 코드 ${res.status}`);
    }
  } catch (err) {
    console.error('failure on patchProduct', err.message);
  }
}

export async function deleteProduct(productId) {
  try {
    const res = await axios.delete(`${BASE_URL}/${productId}`);
    return res.data;
  } catch (err) {
    console.error('failure on deleteProduct:', err.message);
  }
}
