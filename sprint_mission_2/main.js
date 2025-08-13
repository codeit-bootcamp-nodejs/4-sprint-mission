// main.js
import { Article } from './Article.js';
import { Product, ElectronicProduct } from './Product.js';
import { getProductList, products } from './ProductService.js';
import { getArticleList, createArticle } from './ArticleService.js';

async function main() {
  console.log('loading products...');
  await getProductList(1, 10, '');

  console.log('Total products: ', products.length);
  if (products.length > 0) {
    const electronic = products.find((p) => p instanceof ElectronicProduct);
    const general = products.find(
      (p) => p instanceof Product && !(p instanceof ElectronicProduct),
    );

    console.log('Electronic products:', electronic);
    console.log('products:', general);
  } else {
    console.log('No available products.');
  }
  // Article class testing
  console.log('\n testing Article class...');
  const article = new Article('Test Title', 'Test Content', 'Test Writer');
  console.log('Article created:', article);

  // testing like functionality
  console.log('Initial like count:', article.likeCount);
  article.like();
  console.log('Article after liking:', article.likeCount);

  // testing ARticleService
  console.log('\n testing createArticles...');
  const newarticle = await createArticle({
    title: 'test article',
    content: 'description of test article',
  });
  console.log('result of createArticles: ', newarticle);

  console.log('\n testing getArticleList...');
  const articles = await getArticleList();
  if (articles?.length) {
    console.log('number of articles:', articles.length);
    console.log('first article:', articles[0]);
  } else {
    console.log('No articles found.');
  }
}

main();
