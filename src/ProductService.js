const BASE_URL_PRODUCT = 'https://panda-market-api-crud.vercel.app';

export async function getProductList(page = 1, pageSize = 10, keyword = '') {
  try {
    const res = await fetch(`${BASE_URL_PRODUCT}/products?page=${page}&pageSize=${pageSize}&keyword=${keyword}`);
    if (!res.ok) throw res;
    return await res.json();
  } catch (err) {
    console.error('Error fetching product list:', err);
  }
}

export async function getProduct(productId) {
  try {
    const res = await fetch(`${BASE_URL_PRODUCT}/products/${productId}`);
    if (!res.ok) throw res;
    return await res.json();
  } catch (err) {
    console.error('Error fetching product:', err);
  }
}

export async function createProduct(name, description, price, tags, images) {
  try {
    const res = await fetch(`${BASE_URL_PRODUCT}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price, tags, images })
    });
    if (!res.ok) throw res;
    return await res.json();
  } catch (err) {
    console.error('Error creating product:', err);
  }
}

export async function patchProduct(productId, name, description, price, tags, images) {
  try {
    const res = await fetch(`${BASE_URL_PRODUCT}/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price, tags, images })
    });
    if (!res.ok) throw res;
    return await res.json();
  } catch (err) {
    console.error('Error patching product:', err);
  }
}

export async function deleteProduct(productId) {
  try {
    const res = await fetch(`${BASE_URL_PRODUCT}/products/${productId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw res;
    return await res.json();
  } catch (err) {
    console.error('Error deleting product:', err);
  }
}