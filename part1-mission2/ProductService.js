import axios from 'axios';

export class Product {
  constructor(id, name, description, price, tags, images, favoriteCount = 0){
    if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
      this.id = null; 
    } else {
      this.id = id; // id체크 
    }
    this.name = name; // 상품명
    this.description = description; // 상품 설명
    this.price = price; // 상품 가격
    this.tags = []; // 해시태그 배열
    this.images = []; // 이미지 배열
    this.favoriteCount = favoriteCount; // 찜하기 수
  }
  favorite(){
    this.favoriteCount++;
  }
}

export class ElectronicProduct extends Product {
  constructor(id, name, description, price, tags, images, manufacturer, favoriteCount = 0){
    super(id, name, description, price, tags, images,favoriteCount);
    this.manufacturer = manufacturer; // 제조사
  }
}

// 위는 클래스 구현 미션

class ProductApiService{
  constructor(){
    this.url = 'https://panda-market-api-crud.vercel.app/products';
  }
   errorMessage(error){
    if (error.response){
      console.error(`Error: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      console.error(`Error: No response received`, error.request);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
   }

   async getProductList(page = 1, pageSize = 10, keyword = '') {
    const params = {
      page: page,
      pageSize: pageSize,
    }
    if (keyword){
      params.keyword = keyword;
    }

    try {
        const response = await axios.get(this.url, {params: params});
        return response.data;
    } catch (error) {
      this.errorMessage(error);
    }
}

async getProduct(id){
    try {
        const response = await axios.get(`${this.url}/${id}`);
        return response.data;
    } catch (error) {
      this.errorMessage(error);
    }
}

async createProduct(name, description, price, tags, images) {
    const requestBody = {
    name: name,
    description: description,
    price: price,
    tags: [],
    images: [],
  }
  
  try {
        const response = await axios.post(this.url, requestBody);
        return response.data; 

    } catch (error) {
      this.errorMessage(error);
    }
}

async patchProduct(id, name, description, price, tags, images){
  const requestBody = {
    name: name,
    description: description,
    price: price,
    tags: [],
    images: [],
  }

  const patchUrl = `${this.url}/${id}`;

  try {
   const response = await axios.patch(patchUrl, requestBody);
   return response.data; 
  } catch (error) {
      this.errorMessage(error);
    }
}

async deleteProduct(id){
  const deleteUrl = `${this.url}/${id}`;

  try {
   const response = await axios.delete(deleteUrl);
   return response.data; 
  } catch (error) {
      this.errorMessage(error);
  }
}}

export const productApiService = new ProductApiService();
