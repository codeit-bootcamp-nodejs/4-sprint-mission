import axios from 'axios';

const apiUrl = 'https://panda-market-api-crud.vercel.app';

async function getProductList(page, pageSize, keyword) {
    try {
        const res = await axios.get(apiUrl+'/products', {
            page,
            pageSize,
            keyword
        });

        // console.log(res.data);
        return res.data;
    } catch (e) {
        console.error(e);
    }
};

async function getProduct(productId) {
    try {
        const res = await axios.get(apiUrl+`/products/${productId}`)

        // console.log(res.data);
        return res.data;
    } catch (e) {
        console.error(e);
    }
};

async function createProduct(name, description, price, tags, images) {
    try {
        const res = await axios.post(apiUrl+'/products', {
            name, // String
            description, // String
            price, // Number
            tags, // Arrays of string
            images, // Arrays of string
        });

        // console.log(res.data);
        return res.data;
    } catch (e) {
        console.error(e);
        return e;
    }
};

async function patchProduct( { productId, name, description, price, tags, images } ) {
    try {
        const res = await axios.patch(apiUrl+`/products/${productId}`, {
            name, 
            description, 
            price, 
            tags, 
            images,
        });

        // console.log(res.data);
        return res.data;
    } catch (e) {
        console.error(e);
    }
};

async function deleteProduct(productId) {
    try {
        const res = await axios.delete(apiUrl+`/products/${productId}`)

        // console.log(res.data);
        return res.data;
    } catch (e) {
        console.error(e);
    }
};

export default {
    getProductList, 
    getProduct, 
    createProduct,
    patchProduct,
    deleteProduct
};