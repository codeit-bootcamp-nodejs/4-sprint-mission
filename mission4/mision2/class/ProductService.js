const BASE_URL = 'https://panda-market-api-crud.vercel.app';

export async function getProductList(page = 1, pageSize = 10, keyword = '') {
  try {
    const response = await fetch(
      `${BASE_URL}/products?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`
    );

    if (!response.ok) {
      throw new Error(`상품 목록 조회 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('getProductList error:', error.message);
  }
}

export async function getProduct(productId) {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`);

    if (!response.ok) {
      throw new Error(`상품 조회 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('getProduct error:', error.message);
  }
}

export async function createProduct({ name, description, price, tags, images }) {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, description, price, tags, images })
    });

    if (!response.ok) {
      throw new Error(`상품 생성 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('createProduct error:', error.message);
  }
}

export async function patchProduct(productId, { name, description, price, tags, images }) {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, description, price, tags, images })
    });

    if (!response.ok) {
      throw new Error(`상품 수정 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('patchProduct error:', error.message);
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`상품 삭제 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('deleteProduct error:', error.message);
  }
}
