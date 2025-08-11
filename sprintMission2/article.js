import axios from 'axios';

async function getArticleList(page = 1, pageSize = 10, keyword = '') {
         axios.get('https://panda-market-api-crud.vercel.app/docs', {
            params: {
                page,
                pageSize,
                keyword,
            }
         })
        .then(response => {
            console.log('받아온 데이터', response.data);
        })
        .catch(err => {
                console.error('❌ GET 실패:', err.masaage);
            })
        }
getArticleList(1,2,'name');

async function getArticle() {
    axios.get('https://panda-market-api-crud.vercel.app/docs', {

    })
        .then(response => {
            console.log('받아온온 데이터', response.data);
        })
        .catch(err => {
            console.error('❌ GET 에러:', err.message);
    })
        }
getArticle();

async function createArticle() {
    axios.post('https://panda-market-api-crud.vercel.app/docs', {
            title: 'gle',
            content: 'coco',
            image: 'pizza'
   })
        .then(response => {
             console.log('✅ POST 결과:', response.data);
        })
       .catch(err => {
        console.error('❌ POST 에러:', err.massage);
    })
}
createArticle();

async function patchArticle() {
    axios.patch('https://panda-market-api-crud.vercel.app/docs', {
            title: 'modify'
        })
        .then(response => {
            console.log('✅ PATCH 결과:', response.data);
        }) 
         .catch(err => {
        console.error('❌ PATCH 에러:', err.message)
    })
}
patchArticle();

async function deletArticle() {
    axios.delete('https://panda-market-api-crud.vercel.app/docs')
        .then(response => {
            console.log('✅ DELETE 결과:', response.status)
     })  .catch(err => {
            console.error('❌ DELETE 에러:', err.masaage);
     });  
}
deletArticle();