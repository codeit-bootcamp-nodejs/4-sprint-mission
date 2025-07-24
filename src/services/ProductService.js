import axios from 'axios';
import { ElectronicProduct, Product } from '../models/Product.js';

const baseUrl = 'https://panda-market-api-crud.vercel.app/products';

export async function getProductList({page= 1, pageSize= 10, keyword= ''}={}) {
  try {
  const res = await axios.get(baseUrl, {
	params: { page, pageSize, keyword }	
  });
  const data = res.data;
  return data.list.map(item=> {
    if (item.tags.includes('전자제품')) {
      return new ElectronicProduct(
        item.name, 
        item.description, 
        item.price, 
        item.tags, 
        item.images, 
        item.favoriteCount,
        item.manufacturer
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
  })  
  } catch(e) {
    console.error(`getProductList failed: ${e.response?.status || 'No status'} ${e.response?.statusText || e.message}`);
    return [];
  }
}

export async function getProduct(id) {
  try {
  const res = await axios.get(`${baseUrl}/${id}`);
  const data = res.data;
    if (data.tags.includes('전자제품')) {
      return new ElectronicProduct(
        data.name, 
        data.description, 
        data.price, 
        data.tags, 
        data.images, 
        data.favoriteCount,
        data.manufacturer
      );
    } else {
      return new Product(
        data.name, 
        data.description, 
        data.price, 
        data.tags, 
        data.images, 
        data.favoriteCount
      );
      }
  } catch(e) {
   console.error(`getProduct failed: ${e.response?.status || 'No status'} ${e.response?.statusText || e.message}`);
   return null;
    }
}

export async function createProduct(name, description, price, tags, images) {
  try {
  const res = await axios.post(baseUrl, {name, description, price, tags, images});
  const data = res.data;
  console.log(data);
  return data;
  } catch(e) {
   console.error(`createProduct failed: ${e.response?.status || 'No status'} ${e.response?.statusText || e.message}`);
   return null;
  }
}

export async function patchProduct(id, updateValue) {
  try {
  const res = await axios.patch(`${baseUrl}/${id}`, updateValue);
  const data = res.data;
  console.log(data);
  return data;
  } catch(e) {
   console.error(`patchProduct failed: ${e.response?.status || 'No status'} ${e.response?.statusText || e.message}`);
   return null;
  }
}

export async function deleteProduct(id) {
  try {
  const res = await axios.delete(`${baseUrl}/${id}`);
  const data = res.data;
  console.log(data);
  return data;
  } catch(e) {
   console.error(`deleteProduct failed: ${e.response?.status || 'No status'} ${e.response?.statusText || e.message}`);
   return null;
  }
}
