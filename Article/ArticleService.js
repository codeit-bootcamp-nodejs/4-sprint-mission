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

export function getArticle(articleId){
    article_url = `https://panda-market-api-crud.vercel.app/articles/${articleId}`
    return axios.get(article_url)
    .then( (response) => response.data)
    .catch( (error) => console.error(error));
}

export function postArticle({ttle="", contnt="", img=""}){
    let data = {};
    data = {title: ttle, 
        content: contnt,
        image :img}
    axios.post(article_url,data)
    .catch( (error) => console.error(error));
    
}

export function patchArticle({title,content,image},articleId){
    article_url = `https://panda-market-api-crud.vercel.app/articles/${articleId}`
    axios.patch(article_url,
         {"title":title,
        "content":content,
        "image":image
    }).
    catch( (error) => console.error(error));
    
}

export function deleteArticle(articleId){
    article_url = `https://panda-market-api-crud.vercel.app/articles/${articleId}`
    axios.delete(article_url).
    catch( (error) => console.error(error));
    
}