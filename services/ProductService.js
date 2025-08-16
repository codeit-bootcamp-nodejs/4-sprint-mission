import axios from 'axios';

const apiUrl = 'https://panda-market-api-crud.vercel.app';

async function getProductList(page, pageSize, keyword) {
    try {
        const res = await axios.get(apiUrl+'/products', {
            page,
            pageSize,
            keyword
        });

        return res.data;
    } catch (e) {
        console.error(e);
    }
};

async function getProduct(productId) {
    try {
        const res = await axios.get(apiUrl+`/products/${productId}`)

        return res.data;
    } catch (e) {
        console.error(e);
    }
};

async function createProduct(name, description, price, tags, images) {
    try {
        const res = await axios.get(apiUrl+'/products', {
            name, 
            description, 
            price, 
            tags, 
            images
        });

        return res.data;
    } catch (e) {
        console.error(e);
    }
};

async function patchProduct(name, description, price, tags, images) {
    try {
        const res = await axios.get(apiUrl+`/products/${productId}`, {
            name, 
            description, 
            price, 
            tags, 
            images
        });

        return res.data;
    } catch (e) {
        console.error(e);
    }
};

async function deleteProduct(productId) {
    try {
        const res = await axios.get(apiUrl+`/products/${productId}`)

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