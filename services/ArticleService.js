import axios from 'axios';

const apiUrl = 'https://panda-market-api-crud.vercel.app';

function getArticleList(page, pageSize, keyword) {
    axios.get(apiUrl+'/articles', {
        page,
        pageSize,
        keyword
    })
        .then(res => {
            // console.log(res.data)
            return res.data;
        })
        .catch(e => {
            console.error(e);
        })
}

function getArticle(articleId) {
    axios.get(apiUrl+`/articles/${articleId}`)
        .then(res => {
            // console.log(res.data)
            return res.data;
        })
        .catch(e => {
            console.error(e);
        });
}

function createArticle(title, content, image) {
    axios.post(apiUrl+`/articles`, {
        title,
        content,
        image
    })
        .then(res => {
            // console.log(res.data)
            return res.data;
        })
        .catch(e => {
            console.error(e);
        });
}

function patchArticle(articleId, title, content, image) {
    axios.patch(apiUrl+`/articles/${articleId}`, {
        title,
        content,
        image
    })
        .then(res => {
            // console.log(res.data)
            return res.data;
        })
        .catch(e => {
            console.error(e);
        });
}

function deleteArticle(articleId) {
    axios.delete(apiUrl+`/articles/${articleId}`)
        .then(res => {
            // console.log(res.data)
            return res.data;
        })
        .catch(e => {
            console.error(e);
        });
}

export default {
    getArticleList,
    getArticle,
    createArticle,
    patchArticle,
    deleteArticle
};