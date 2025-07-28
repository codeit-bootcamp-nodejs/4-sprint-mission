const BASE_URL = 'https://panda-market-api-crud.vercel.app';

// getProductList: 상품 리스트를 받아오는 함수 (page, pageSize, keyword 쿼리 파라미터를 이용)
export async function getProductList({ page = 1, pageSize = 10, keyword = '' } = {}) {
  try {
    const url = new URL(`${BASE_URL}/products`);
    if (page) url.searchParams.append('page', page);
    if (pageSize) url.searchParams.append('pageSize', pageSize);
    if (keyword) url.searchParams.append('keyword', keyword);

    const res = await fetch(url);

    if (!res.ok) {
      console.error('상품 리스트 조회 실패:', res.status);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('getProductList 에러:', err.message);
    return null;
  }
}

// getProduct: 특정 상품 하나를 조회하는 함수
export async function getProduct(productId) {
  try {
    const res = await fetch(`${BASE_URL}/products/${productId}`);

    if (!res.ok) {
      console.error('상품 조회 실패:', res.status);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('getProduct 에러:', err.message);
    return null;
  }
}

// createProduct: 요청 body에 name, description, price, tags, images 포함하여 상품 생성
export async function createProduct({ name, description, price, tags, images }) {
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price, tags, images }),
    });

    if (!res.ok) {
      console.error('상품 생성 실패:', res.status);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('createProduct 에러:', err.message);
    return null;
  }
}

// patchProduct: 특정 상품(productId)의 이름, 설명, 가격, 태그, 이미지를 수정하는 함수
export async function patchProduct(productId, { name, description, price, tags, images }) {
  try {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price, tags, images }),
    });

    if (!res.ok) {
      console.error('상품 수정 실패:', res.status);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('patchProduct 에러:', err.message);
    return null;
  }
}

// deleteProduct: 특정 상품(productId)을 삭제하는 함수
export async function deleteProduct(productId) {
  try {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      console.error('상품 삭제 실패:', res.status);
      return false;
    }

    return true;
  } catch (err) {
    console.error('deleteProduct 에러:', err.message);
    return false;
  }
}