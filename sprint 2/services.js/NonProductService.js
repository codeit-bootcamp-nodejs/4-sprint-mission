import  axios  from "axios";

const BASE_URL = 'https://panda-market-api-crud.vercel.app';

const ProductService = { 

    // 1. 상품 목록 조회 
    async getProductList(params = {page:1, pageSize: 10, keyword: ''}){
        const res = await axios.get(`${BASE_URL}/products`,{params} )
        return res.data
    },


     //2. 상품 상세 조회
    async getProduct(productId) {
        const res = await axios.get(`${BASE_URL}/products/${productId}`)
        return res.data
    },

    //3. 상품 생성 하기
    async createProduct(productData) {
        const res = await axios.post(`${BASE_URL}/products/`,
            productData
        )
        return res.data;
    },

    //4. 상품 수정 하기
    async patchProduct(productId, productData) {
        const res = await axios.patch(`${BASE_URL}/products/${productId}`,
            productData
        )
        return res.data;
    },

    // 5. 상품 삭제 하기
    async deleteProduct(productId) {
        const res = await axios.delete(`${BASE_URL}/products/${productId}`)
        return res.data;
    }
    
}

export default ProductService
   

