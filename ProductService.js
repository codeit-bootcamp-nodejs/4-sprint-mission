/**
 *   파일명 : ProductService.js
 *   등록일 : 2025.07.24
 *   등록자 : 변재윤
 *   수정내역 : 버전 올림  v1.0
 * */
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://panda-market-api-crud.vercel.app',
    timeout: 5000
});

/**
 * getProductList
 * @param {*} params 
 * @returns 
 */
export async function getProductList(params = {}){
    console.log('====> (API) getProductList..');
    const res = await instance.get('/products', {
        params
    });
    return res.data;
};

/**
 * getProduct
 * @param {*} id 
 * @returns 
 */
export async function getProduct(id){
    console.log(`====> (API) getProduct.. id: ${id}`);
    const res = await instance.get(`/products/${id}`);
    return res.data;
};

/**
 * createProduct
 * @param {*} prdData 
 * @returns 
 */
export async function createProduct(prdData){
    console.log('====> (API) createProduct..');
    const res = await instance.post('/products', prdData);
    return res.data;
};

/**
 * patchProduct
 * @param {*} prdData 
 * @param {*} id 
 * @returns 
 */
export async function patchProduct(prdData, id){
    console.log('====> (API) patchProduct..');
    const res = await instance.patch(`/products/${id}`, prdData);
    return res.data;
}

/**
 * deleteProduct
 * @param {*} id 
 * @returns 
 */
export async function deleteProduct(id){
    console.log('====> (API) deleteProduct..');
    const res = await instance.delete(`/products/${id}`);
    return res.data;
}



