import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "https://panda-market-api-crud.vercel.app"
})

export async function getProduct(id) {
    if (id === undefined) return `id 값을 입력하지 않았습니다.`;
    try {
        const {data} = await axiosInstance.get(`/products/${id}`);
        return data;
    } catch (e) {
        console.error(e);
        if (e.response) {
            console.log(e.response.status);
            console.log(e.response.data);
        } else { // response가 실패한 경우
            console.log(e.message);
        }
    }
}
export async function getProductList(page = 1, pageSize = 10, keyword) {
    const params = {
        page,
        pageSize,
        keyword
    }
    try {
        const {data} = await axiosInstance.get(`/products`, { params });
        return data;
    } catch (e) {
        console.error(e);
        if (e.response) {
            console.log(e.response.status);
            console.log(e.response.data);
        } else { // response가 실패한 경우
            console.log(e.message);
        }
    }
}
export async function createProduct({ name = 'default', description = 'default', price = 0, tags = ['default'], images = ['https://example.com/...'] }) {
    const params = {
        name,
        description,
        price,
        tags,
        images
    }
    try {
        const {data} = await axiosInstance.post(`/products`, params);
        return data;
    } catch (e) {
        console.error(e);
        if (e.response) {
            console.log(e.response.status);
            console.log(e.response.data);
        } else { // response가 실패한 경우
            console.log(e.message);
        }
    }
}
export async function patchProduct(id, { name = 'default', description = 'default', price = 0, tags = ['default'], images = ['https://example.com/...'] }) {
    if (id === undefined) return `id 값을 입력하지 않았습니다.`;
    const params = {
        name,
        description,
        price,
        tags,
        images
    }
    try {
        const {data} = await axiosInstance.patch(`/products/${id}`, params);
        return data;
    } catch (e) {
        console.error(e);
        if (e.response) {
            console.log(e.response.status);
            console.log(e.response.data);
        } else { // response가 실패한 경우
            console.log(e.message);
        }
    }
}
export async function deleteProduct(id) {
    if (id === undefined) return `id 값을 입력하지 않았습니다.`;
    try {
        const {data} = await axiosInstance.delete(`/products/${id}`);
        return data;
    } catch (e) {
        console.error(e);
        if (e.response) {
            console.log(e.response.status);
            console.log(e.response.data);
        } else { // response가 실패한 경우
            console.log(e.message);
        }
    }
}