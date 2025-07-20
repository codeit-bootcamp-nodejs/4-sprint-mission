import axios from 'axios'


let article_url = 'https://panda-market-api-crud.vercel.app/articles' 


export function getArticleList(page_input=1, pageSize_input=10, keyword_input=""){
    return axios.get(article_url,{params: {
        page : page_input, 
        pagesize : pageSize_input,
        keyword : keyword_input
    }})
    .then( (response) => response.data)
    .catch( (error) => console.error(error));
}

export function getArticle(){
    return axios.get(url)
    .then( (response) => response.data)
    .catch( (error) => console.error(error));
}

export function postArticle(ttle="", contnt="", img=""){
    let data = {};
    data = {title: ttle, 
        content: contnt,
        image :img}
    a = axios.post(article_url,data).catch( (error) => console.error(error));
    
}

export function patchArticle(){
    a = axios.patch(article_url).catch( (error) => console.error(error));
    
}

export function deleteArticle(){
    a = axios.delete(article_url).catch( (error) => console.error(error));
    
}