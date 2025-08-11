import axios from 'axios'

export async function getProductList(page = 2, pageSize = 12, keyword = '') {
    try {
    const reponse = await axios.get('https://panda-market-api-crud.vercel.app/docs', {
        params: {page, pageSize, keyword }
    }); 
    console.log('받아온 데이터', reponse.data);
} catch (error) {
    console.error('에러 발생', error.message);
}   
}
getProductList(2,3,'5')

async function getProduct() {
    try {
        const reponse = await axios.get('https://panda-market-api-crud.vercel.app/docs')
    console.log('받아온온 데이터', reponse.data);
} catch (error) {
    console.error('에러 발생', error.message);
} 
}
getProduct();

async function createProduct(name, description, price, tags, images) {
    try {
        const reponse = await axios.post('https://panda-market-api-crud.vercel.app/docs', {
       params: {name, description, price, tags, images}
    })
        console.log('Post 성공', response.data);
    } catch {
        console.err('Post 에러', err.message)
    }    
};
createProduct();

async function patchProduct() {
    try {
        const reponse = await axios.patch('https://panda-market-api-crud.vercel.app/docs', {
        name: coach
    })
        console.log('Patch 성공', response.data)
    } catch (err) {
        console.err('Patch 에러', err.message)
    }
};
patchProduct();

async function deleteProduct() {
    try {
        const reponse = await axios.delete('https://panda-market-api-crud.vercel.app/docs')
        console.log('delete 성공', response.data)
    } catch (err) {
        console.err('delete 에러', err.message)
    };
}
deleteProduct();
