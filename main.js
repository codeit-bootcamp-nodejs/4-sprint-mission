/**
 *  등록일자 : 2025.07.22
 *  등록자 : 변재윤
 *  수정내역 : 버전올림  v1.0 최초등록
 *           v1.1 bjy001-patch-1 에서 변재윤-sprint2 로 브랜치명 변경
 *           v1.2 변재윤-sprint2 => 변재윤-sprint1 로 브랜치명 변경
 *
 */

import { getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from './ArticleService.js';
import { getProductList, getProduct, createProduct, patchProduct, deleteProduct } from './ProductService.js';
import { Product }  from './Product.js';
import { Article }  from './Article.js';

async function main(){

  /**
   *   ###################
   *    스프린트 미션2 시작
   *   ##################
   *  
   * */ 

    /* Product 클래스 */ 
     const product = new Product('노트북', '변재윤 노트북꺼', 1500000, ['전자제품'], ['image.jpg']);
     console.log('1. Product 클래스 시작 ----------')
     console.log(product);
     console.log('===================================');
     /* Article 클래스 */
     const article = new Article('재테크방법론', '서서히 부자되기', '변재윤');
     console.log('2. Article 클래스 시작 ----------')
     article.like();
     console.log('title: ',   article.getTitle());
     console.log('content: ', article.getContent());
     console.log('writer: ' , article.getWriter());
     console.log('likeCount: ' , article.getLikeCount());

    /* ############### [1] Article API ######################## */
    
    const requestData = {
      title: 'codeit 테스트북',  //id: 1937
      content: '테스트 내용 codeit 시작..끝',
      image: 'https://example.com/..'
    };

    const modifyData = {
      title: 'codeit 테스트북(수정)', //id: 1937
      content: '테스트 내용 codeit 시작..끝(수정)',
      image: 'https://example.com/..(수정)'
    };

    /** 1. getArticleList */
    const articleList = await getArticleList();
    console.log(articleList);

    /** 2. getArticle */
    const articleData = await getArticle(1905);
    console.log(articleData);
    
    /** 3. createArticle */
    try{
      const resData = await createArticle(requestData);
      console.log(resData);
    } catch(e){
      if (e.response){
        console.log(e.response.data);
      } else {
        console.log('리퀘스트가 실패했습니다!');
      }
    }

    /** 4. patchArticle */
    try{
      const updData = await patchArticle(modifyData, 1937);
      console.log(updData);
    } catch(e) {
      if(e.response){
        console.log(e.response.data);
      } else {
        console.log('리퀘스트가 실패했습니다.');
      }
    };

    /** 5. deleteArticle */
    try{
      const delData = await deleteArticle(1937);
      console.log(delData);
    } catch(e) {
      if(e.response){
        console.log(e.response.data);
      } else {
        console.log('리퀘스트가 실패했습니다.');
      }
    };

    // ############### [2] Product API ########################

    const prdData = {
      name: '변재윤 노트북',
      description: '노트북 모델번호 BJ2456P',
      price: 1500000,
      tags: [],
      images: 'https://example.com/...'
    };

    const prdUpdData = {
      name: '변재윤 노트북(수정)',
      description: '노트북 모델번호 BJ2456P(수정)',
      price: 1500000,
      tags: [],
      images: 'https://example.com/...'
    };

    /** 1. getProductList */
    const prodParams = {
      page: 1,
      pageSize: 5,
      keyWord: ''
    };
    const prodList = await getProductList(prodParams);
    console.log(prodList);

    /** 2. getProductList */
    const prodData = await getProduct(1426);
    console.log(prodData);

    /** 3. createProduct */  
    try{
      const res = await createProduct(prdData);
      console.log(res);
    } catch(e) {
      if(e.response){
        console.log(e.response.data);
      }else{
        console.log('리퀘스트에 실패했습니다!')
      }
    };

    /** 4. patchProduct */  
    try{
      const updRes = await patchProduct(prdUpdData, 1426);
      console.log(updRes);
    } catch(e) {
      if(e.response){
        console.log(e.response.data);
      }else{
        console.log('리퀘스트에 실패했습니다!')
      };
    };

    /** 5. deleteProduct */  
    try{
      const delRes = await deleteProduct(1426);
      console.log(delRes);
    } catch(e) {
      if(e.response){
        console.log(e.response.data);
      }else{
        console.log('리퀘스트에 실패했습니다!')
      };
    };

    /**
     *  ########################################################################################## 
     *    getProductList  를 통해 받아온 상품 리스트를 각각 인스턴스로 만들어 products 배열에 저장해주세요.
     *     - 해시태그 배열(tags)에 “전자제품”이 포함되어 있는 상품들은 ElectronicProduct 클래스 인스턴스로 생성, products 배열에 넣어주세요.
     *     - 나머지 다른 상품들은 Product 클래스 인스턴스로 생성, products 배열에 넣어주세요.
     *  ################################################################# #######################
     * 
     */
    // const prodList = await getProductList(prodParams);
    // console.log(prodList.list);
    // let numArrs = prodList.list.map(p => {
    //   console.log(p.name);
    // });

    const products = prodList.list.map(p => {
      return new Product(
        p.name,
        p.description,
        p.price,
        p.tags,
        p.images,
        p.favoriteCount
      );
    });
    console.log(products);
     

};

main();





