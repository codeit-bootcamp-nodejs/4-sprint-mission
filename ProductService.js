/**
 * 클래스 구현. trt catch 활용 API, 모듈
 */
export class Product {
  constructor(name, description, price, tags = [], images = [], favoriteCount = 0) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount;
  }

  favorite() {
    this.favoriteCount += 1;
  }
}

export class ElectronicProduct extends Product {
  constructor(name, description, price, tags = [], images = [], favoriteCount = 0, manufacturer = '') {
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer;
  }
}

const API_URL = 'https://panda-market-api-crud.vercel.app/products';

export async function getProductList(page = 1, pageSize = 10, keyword = '') {
  try {
    const res = await fetch(`${API_URL}?page=${page}&pageSize=${pageSize}&keyword=${keyword}`);
    if (!res.ok) throw new Error('상품 목록 조회 실패');
    return await res.json();
  } catch (e) {
    console.error(e.message);
  }
}

export async function getProduct(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('상품 조회 실패');
    return await res.json();
  } catch (error) {
    console.error(e.message);
  }
}

export async function createProduct(product) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('상품 생성 실패');
    return await res.json();
  } catch (e) {
    console.error(e.message);
  }
}

export async function patchProduct(id, update) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    if (!res.ok) throw new Error('상품 수정 실패');
    return await res.json();
  } catch (e) {
    console.error(e.message);
  }
}

export async function deleteProduct(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('상품 삭제 실패');
    return await res.json();
  } catch (e) {
    console.error(e.message);
  }
}
