import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://panda-market-api-crud.vercel.app',
})

export async function getArticleList({page, pageSize, keyword}) { 
    //Q: 파라미터 객체로 넣어야 좋나? > A: 개별파라미터
    //Q: 이미 기능구현했는 데, Response와 같이 할당안해도 되는지?
        instance.get('/articles', {
        params : {
        page: page,
        pageSize: pageSize,
        keyword: keyword
        }
    })    
    .then((response) => {
     console.log(response.data);
    return response.data;
    })
    //Q: 더 좋은 에러 처리방법이 있는지?
    .catch((error) => {
        if(error.response){
            console.log(error.response.data)
        }
    })       
}
//test
//getArticleList(1, 10, "")

export async function getArticle(articleId) {
    await instance.get(`/articles/${articleId}`)
    .then(response => {
        console.log(response.data);
        return response.data;
    })
    .catch((error) => {
    if(error.response){
        console.log(error.response.data)
    }    
 })
}
//test
//getArticle(1)

export async function createArticle({title, content, image}) {
    //파라미터가 객체형식
    await instance.post('/articles',{
        title : title,
        content: content,
        image : image
    })
    .then(response => console.log(response.data))
    .catch(error => console.log(error.message))
}

// Test
// createArticle({
//   "image": "https://example.com/...",
//   "content": "게시글 내용입니다.",
//   "title": "게시글 제목입니다."
// })

export async function patchArticle(articleId, {
    image,
    content,
    title
}) {
    await instance.patch(`/articles/${articleId}`, {
    image: image,
    content: content,
    title: title
    })
    .then(response => console.log(response.data))
    .catch(e => {
        if(e.response){
            console.log(e.response.data)
        }
    }) 
}
// test
// patchArticle(1, {
//     "image": "https://example.com/...",
//     "content": "게시글 내용입니다.",
//     "title": "게시글 제목입니다."
// })

export async function deleteaArticle(articleId) {
    await instance.delete(articleId)
    .then(response => console.log(response.data))
    .catch(e => {
            if(e.response){
            e.response.data.message = "게시글을 찾을 수 없습니다." 
            console.log(e.response.data)
            //Q: 스웨거랑 다른메시지?, 위처럼 임의로 해도되나?
            //에러 객체 추가했을 때, 객체표기로 만드는 법?            
        }
    })
}

//test
//deleteaArticle(0)