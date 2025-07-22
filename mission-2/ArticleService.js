import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "https://panda-market-api-crud.vercel.app"
})

export async function getArticle(id) {
    if (id === undefined) return `id 값을 입력하지 않았습니다.`;
    return await axiosInstance.get(`/articles/${id}`)
        .then(response => response.data)
        .catch(e => {
            if (e.response) {
                console.log(e.response.status);
                console.log(e.response.data);
            } else { // response가 실패한 경우
                console.log(e.message);
            }
        })
}
export async function getArticleList(page = 1, pageSize = 10, keyword) {
    const params = {
        page,
        pageSize,
        keyword
    }
    return await axiosInstance.get(`/articles`, { params })
        .then(response => response.data)
        .catch(e => {
            if (e.response) {
                console.log(e.response.status);
                console.log(e.response.data);
            } else { // response가 실패한 경우
                console.log(e.message);
            }
        })
}
export async function createArticle({ title = 'default', content = 'content', image = 'https://example.com/...' }) {
    const params = {
        title,
        content,
        image
    }
    return await axiosInstance.post(`/articles`, params)
        .then(response => response.data)
        .catch(e => {
            if (e.response) {
                console.log(e.response.status);
                console.log(e.response.data);
            } else { // response가 실패한 경우
                console.log(e.message);
            }
        })
}
export async function patchArticle(id, { title = 'default', content = 'default', image = 'https://example.com/...' }) {
    if (id === undefined) return `id 값을 입력하지 않았습니다.`;
    const params = {
        title,
        content,
        image
    }
    return await axiosInstance.patch(`/articles/${id}`, params)
        .then(response => response.data)
        .catch(e => {
            if (e.response) {
                console.log(e.response.status);
                console.log(e.response.data);
            } else { // response가 실패한 경우
                console.log(e.message);
            }
        })
}
export async function deleteArticle(id) {
    if (id === undefined) return `id 값을 입력하지 않았습니다.`;
    return await axiosInstance.delete(`/articles/${id}`)
        .then(response => response.data)
        .catch(e => {
            if (e.response) {
                console.log(e.response.status);
                console.log(e.response.data);
            } else { // response가 실패한 경우
                console.log(e.message);
            }
        })
}