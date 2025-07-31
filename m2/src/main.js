import * as ArticleApi from "./services/ArticleService.js";
import * as ProductApi from "./services/ProductService.js";
import { Product } from "./classes/Product.js";
import { ElectronicProduct } from "./classes/ElectronicProduct.js";

// === Article Test === //   

const articleQueryParams = {
    page: 1,
    pageSize: 10,
    keyword: "작성",
};

const findArticleList = await ArticleApi.getArticleList(articleQueryParams);
console.log(findArticleList);

const findArticle = await ArticleApi.getArticle(findArticleList.list[2].id);
console.log(findArticle);

const newArticle = {
    title: 'nodejs backend 4th',
    content: 'Requet and Response Mission using Axios and Fetch',
    image: 'https://dummyimage.com/150x150'
};

const createdArticle = await ArticleApi.createArticle(newArticle);
console.log(createdArticle);

const updateArticleData = {
    title: 'nodejs backend 4th team1',
    content: 'Requet and Response Mission using Axios and Fetch',
    image: 'https://dummyimage.com/150x150'
};

const updatedArticle = await ArticleApi.patchArticle(createdArticle.id, updateArticleData);
console.log(updatedArticle);

const deletedArticleResult = await ArticleApi.deleteArticle(updatedArticle.id);
console.log(deletedArticleResult);

// === Product Test === //

const productQueryParams = {
    page: 1,
    pageSize: 10,
    keyword: '전자제품',
};

const findProductList = await ProductApi.getProductList(productQueryParams);
// console.log(findProductList); // 실제 응답 data
const { list: productItems } = findProductList;

const products = [];
const targetTag = '전자제품';

productItems.forEach((prod) => {
    const { name, description, price, tags, images, manufacturer } = prod;

    if (tags && tags.includes(targetTag)) {
        const electronicProduct = new ElectronicProduct({
            name,
            description,
            price,
            tags,
            images,
            manufacturer
        });

        products.push(electronicProduct);
    } else {
        const product = new Product({name, description, price, tags, images});

        products.push(product);
    }
});

products.forEach((prod) => {
    console.log(prod.name);
    console.log(prod.description);
    console.log(prod.price);
    console.log(prod.tags);
    console.log(prod.images);
    if(prod instanceof ElectronicProduct) {
        console.log(prod.manufacturer);
    }
});

const findProduct = await ProductApi.getProduct(productItems[2].id);
console.log(findProduct);

const newProduct = {
    name: '전자제품',
    description: '맥북 에어 2029',
    price: 3000000,
    tags: ['#애플', '#노트북', '#Air'],
    images: ['https://dummyimage.com/150x150']
};

const createdProduct = await ProductApi.createProduct(newProduct);
console.log(createdProduct);

const updateProductData = {
    name: 'NEW 전자제품',
    description: '맥북 에어 2029',
    price: 3000000,
    tags: ['#애플', '#노트북', '#Air'],
    images: ['https://dummyimage.com/150x150']
};

const updatedProduct = await ProductApi.patchProduct(createdProduct.id, updateProductData);
console.log(updatedProduct);

const deletedProductResult = await ProductApi.deleteProduct(updatedProduct.id);
console.log(deletedProductResult);
