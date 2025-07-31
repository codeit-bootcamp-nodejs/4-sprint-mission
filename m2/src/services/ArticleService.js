import instance from "../api/axios.js";

// [GET] findAll (https://panda-market-api-crud.vercel.app/articles)
export function getArticleList(queryParams = {}) {
    const defaultParams = {
        page: 1,
        pageSize: 10,
        keyword: "뉴진스",
    };

    const params = { ...defaultParams, ...queryParams };

    return instance.get(`/articles`, { params })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(`${error.name} : ${error.message}`);
        });
}

// [GET] findById (https://panda-market-api-crud.vercel.app/articles/{id})
export function getArticle(id) {
    return instance.get(`/articles/${id}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(`${error.name} : ${error.message}`);
        });
}

// [POST] create (https://panda-market-api-crud.vercel.app/articles)
export function createArticle(article) {
    return instance.post(`/articles`, article)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(`${error.name} : ${error.message}`);
        });
}

// [PATCH] updateById (https://panda-market-api-crud.vercel.app/articles/{id})
export function patchArticle(id, updateData) {
    return instance.patch(`/articles/${id}`, updateData)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(`${error.name} : ${error.message}`);
        });
}

// [DELETE] deleteById (https://panda-market-api-crud.vercel.app/articles/{id})
export function deleteArticle(id) {
    return instance.delete(`/articles/${id}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(`${error.name} : ${error.message}`);
        });
}
