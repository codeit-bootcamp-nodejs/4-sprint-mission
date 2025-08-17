import axios from 'axios';

const URL= 'https://panda-market-api-crud.vercel.app/products/';

export async function getProductList({page, pageSize, keyword}) {
  try {
    const res = await axios.get(URL,{
      params: {page, pageSize, keyword}
    });
    return res.data;
  } catch (e) {
    console.error('목록을 가져오는 중 오류가 발생했습니다.');
  }
}

export async function getProduct(productId) {
  try {
    const res = await axios.get(`${URL}${productId }`)
    return res.data;
  } catch (e) {
    console.error('오류가 발생했습니다.');
  }
}

export async function createProduct({name, description, price, tags, images}) {
  try {
    const res = await axios.post(
      `${URL}`,
      {name, description, price, tags, images},
    );
    return res.data;
  } catch (e) {
    console.error('오류가 발생했습니다.');
  }
}

export async function patchProduct(productId,{name, description, price, tags, images} ) {
  try {
    const res = await axios.patch(
      `${URL}${productId}`,
      {name, description, price, tags, images},
    );
    return res.data;
  } catch (e) {
    console.error('오류가 발생했습니다.', e.response?.data || e.message || e);
  }
}

export async function deleteProduct(productId) {
  try {
    const res = await axios.delete(`${URL}${productId}`);
    return res.data;
  } catch (e) {
    console.error('오류가 발생했습니다.');
  }
}
