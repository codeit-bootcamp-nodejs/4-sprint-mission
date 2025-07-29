class Article {
    
    constructor(title, content, writer, likeCount = 0) {
      this.title = title;
      this.content = content;
      this.writer = writer;
      this.likeCount = likeCount;

      //새로운 객체가 생성되어 constructor가 호출될 시 현재 시간을 저장
      this.createdAt = new Date();
    }
  
    like() {
      this.likeCount++;
    }
  }

class ArticleService {
  
    //GET, page, pageSize, keyword 쿼리 파라미터 사용
    async getArticleList({ page = 1, pageSize = 10, keyword = '' }) {
        fetch(`https://panda-market-api-crud.vercel.app/articles?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`)
          .then(response => {
            if (!response.ok) {
              console.error(`서버 오류: ${response.status} ${response.statusText}`);
              throw new Error('오류');
            }
            return response.json();
          })
          .then(data => {
            console.log('수신성공:', data);
          })
          .catch(error => {
            console.error('오류:', error.message);
          });
      }
      
   
    //GET
    async getArticle(articleId) {
      const response = await fetch(
        `https://panda-market-api-crud.vercel.app/articles/${articleId}`
      );
      if (!response.ok) throw new Error('조회 실패');
      return await response.json();
    }
  
    //POST ,request body에 title, content, image 를 포함
    async createArticle({ title, content, image }) {
      const response = await fetch('https://panda-market-api-crud.vercel.app/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, image })
      });
      if (!response.ok) throw new Error('생성 실패');
      return await response.json();
    }
   

    //PATCH
    async patchArticle(articleId, updateData) {
      const response = await fetch(
        `https://panda-market-api-crud.vercel.app/articles/${articleId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        }
      );
      if (!response.ok) throw new Error('수정 실패');
      return await response.json();
    }
  

    //DELETE
    async deleteArticle(articleId) {
      const response = await fetch(
        `https://panda-market-api-crud.vercel.app/articles/${articleId}`,
        {
          method: 'DELETE'
        }
      );
      if (!response.ok) throw new Error('삭제 실패');
      return await response.json();
    }
  }
  

  //export 
export { Article, ArticleService };