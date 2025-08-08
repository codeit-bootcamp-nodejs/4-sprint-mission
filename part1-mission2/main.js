import { productApiService, Product, ElectronicProduct } from './ProductService.js'; 
import { articleApiService, Article }  from './ArticleService.js';

const products = [];
const articles = [];

async function loadProducts() {
    try {
         const rawProductListData = await productApiService.getProductList()
         const actualProductArray = rawProductListData.list

         const products = actualProductArray.map(productData => { 
         const { id, name, description, price, tags, images, favoriteCount } = productData;

            return tags.includes('전자제품')
         ?new ElectronicProduct(id, name, description, price, tags, images, productData.manufacturer, favoriteCount)
         :new Product(id, name, description, price, tags, images, favoriteCount);
        });

        console.log(products); 

    } catch (error) {
        console.error('상품 리스트를 로드하는 중 오류가 발생했습니다:', error);
    }
}
async function loadArticles() {
    try {
         const rawArticleListData = await articleApiService.getArticlesList();
         const actualArticleArray = rawArticleListData.list;

         const articles = actualArticleArray.map(articleData => { 
         const { id, title, content, writer, likeCount, createdAt } = articleData;
            return new Article( id, title, content, writer, likeCount);
        });

        console.log(articles); 

    } catch (error) {
        console.error('게시글을 로드하는 중 오류가 발생했습니다:', error);
    }
}

async function test() {
    console.log('\n------상품 목록------\n')
    await loadProducts();
    console.log('\n------게시글 목록------\n')
    await loadArticles();
}

test();

