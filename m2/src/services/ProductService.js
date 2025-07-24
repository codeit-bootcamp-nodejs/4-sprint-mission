import instance from "../api/axios.js";

// [GET] findAll (https://panda-market-api-crud.vercel.app/products)
export async function getProductList(queryParams = {}) {
    const defaultParams = {
        page: 1,
        pageSize: 10,
        keyworde: "NEW",
    };

    const params = { ...defaultParams, ...queryParams };

    try {
        const response = await instance.get(`/products`, { params });
        return response.data;
    } catch (error) {
        console.log(`${error.name} : ${error.message}`);
    }
}

// [GET] findById (https://panda-market-api-crud.vercel.app/products/{id})
export async function getProduct(id) {
    try {
        const response = await instance.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.log(`${error.name} : ${error.message}`);
    }
}

// [POST] create (https://panda-market-api-crud.vercel.app/products)
export async function createProduct(product) {
    try {
        const response = await instance.post(`/products`, product);
        return response.data;
    } catch (error) {
        console.log(`${error.name} : ${error.message}`);
    }
}

// [PATCH] updateById (https://panda-market-api-crud.vercel.app/products/{id})
export async function patchProduct(id, updateData) {
    try {
        const response = await instance.patch(`/products/${id}`, updateData);
        return response.data;
    } catch (error) {
        console.log(`${error.name} : ${error.message}`);
    }
}

// [DELETE] deleteById (https://panda-market-api-crud.vercel.app/products/{id})
export async function deleteProduct(id) {
    try {
        const response = await instance.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.log(`${error.name} : ${error.message}`);
    }
}
