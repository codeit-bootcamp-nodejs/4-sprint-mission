import  axios  from "axios";

const BASE_URL = 'https://panda-market-api-crud.vercel.app';

const ProductService = { 

    // 1. 상품 목록 조회 
    async getProductList(params = {page: 1, pageSize: 10, keyword: ''}) {
    // 비동기 함수: await 사용 가능하도록 async 선언
    // params 는 현재 함수를 호출할 때, 어떤 조건으로 보여줄지 기본값 & 파라미터를 설정함
    
    const res = await axios.get(`${BASE_URL}/products`, { params });
    // get메소드로 리퀘스트

    return res.data;
    // 서버로 받은 리스폰스 값이 데이터에 담김
    },
    



    //2. 상품 상세 조회
    async getProduct(productId) { 
        // 파라미터에 조회할 상품의 주소를 파라미 터에 받을 예정

        const res = await axios.get(`${BASE_URL}/products/${productId}`) 
        // get메소드를 활용해 해당 주소를 리퀘스트 

        return res.data
        // 리스폰스 값이 data에 담김
    },





    //3. 상품 생성 하기
    async createProduct(productData) { 
        // 생성한 상품에 대한 정보를 파라미터에 받을 예정 

        const res = await axios.post(`${BASE_URL}/products/`,
            productData
        )
        // post 메소드를 활용해서 리퀘스트
        // 첫번째 파라미터에는 보낼 주소, 두번째 파라미터에는 바디(만들 상품 정보)를 작성

        return res.data;
        // 리스폰스 값이 data에 담김
    },





    //4. 상품 수정 하기
    async patchProduct(productId, productData) {
        // 수정할 내용을 파라미터로 받을 예정

        const res = await axios.patch(`${BASE_URL}/products/${productId}`,
            productData
        )
        // patch 메소드를 활용해 리퀘스트 
        // 첫 번째 파라미터는 수정할 정확한 상품(productId) 주소를 입력
        // 두 번째 파라미터는 바디(수정할 내용) 입력

        return res.data;
        // 리스폰스 값이 data에 담김
    },





    // 5. 상품 삭제 하기
    async deleteProduct(productId) {
        // 삭제할 상품 페이지를 파라미터로 받을 예정

        const res = await axios.delete(`${BASE_URL}/products/${productId}`)
        // delete 메소드를 활용해서 해당 주소를 리퀘스트 
        
        return res.data;
        // 리스폰스 값이 data에 담김
    }
    
}
   

export default ProductService