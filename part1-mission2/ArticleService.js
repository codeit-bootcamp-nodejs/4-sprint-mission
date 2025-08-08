import axios from 'axios';

export class Article {
  constructor(id, title, content, writer, likeCount = 0){
     if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
      this.id = null; 
    } else {
      this.id = id; // id 체크
    }
    this._title = ''; // 제목
    this._content = ''; // 내용
    // this._writer = ''; // 작성자
    this.likeCount = likeCount; // 좋아요 수
    this.createdAt = new Date(); // 새 객체 생성시 시간

    this.title = title;
    this.content = content;
    this.writer = writer;
  }

  get title(){
    return this._title;
  }
  
  set title(newTitle){
    if (newTitle.length === 0){
      return;
    }
    this._title = newTitle;
  }

  get content(){
    return this._content;
  }

  set content(newContent){
    if (newContent.length === 0){
      return;
    }
    this._content = newContent;
  }

  // get writer(){
  //   return this._writer;
  // }

  // set writer(newWriter){
  //   if (newWriter.length === 0){
  //     return;
  //   }
  //   this._writer = newWriter;
  // }
  like(){
    this.likeCount++;
  }
}

// 위는 클래스 구현 미션

class ArticleApiService{
  constructor(){
    this.url = 'https://panda-market-api-crud.vercel.app/articles';
  }

errorMessage(error){
    if (error.response){
      console.error(`Error: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      console.error(`Error: No response received`, error.request);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
   }

getArticlesList(page = 1, pageSize = 10, keyword = '') {
    const params = {
      page: page,
      pageSize: pageSize,
    }
    if (keyword){
      params.keyword = keyword;
    }
    return axios.get(this.url, {params: params})
    .then(response => {
      return response.data;
    })
    .catch(error => {
      this.errorMessage(error);
    })
}

getArticle(id){
        return axios.get(`${this.url}/${id}`)
        .then(response => {
          return response.data;
        })
        .catch(error => {
          this.errorMessage(error)
        })
    }

createArticle(title, content, image) {
   const requestBody = {
    title: title,
    content: content,
    }
    if(image){
    requestBody.image = image;
    }
  
      return axios.post(this.url, requestBody)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        this.errorMessage(error)
      })
}

patchArticle(id, title, content, image){
  const requestBody = {
    title: title,
    content: content,
    }

    if(image){requestBody.image = image;}

  const patchUrl = `${this.url}/${id}`;

    return axios.patch(patchUrl, requestBody)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      this.errorMessage(error);
    })
  }

async deleteArticle(id){
  const deleteUrl = `${this.url}/${id}`;

  return axios.delete(deleteUrl)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    this.errorMessage(error);
  })
}}

export const articleApiService = new ArticleApiService();
