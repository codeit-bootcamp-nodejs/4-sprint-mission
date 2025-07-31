import { getArticle, getArticleList, createArticle, patchArticle, deleteArticle } from "./ArticleService.js";
import { getProduct, getProductList, createProduct, patchProduct, deleteProduct } from "./ProductService.js";
import Article from "./Article.js";
import Product from "./Product.js";
import ElectronicProduct from "./ElectronicProduct.js";

const articleTest = {
    title: '게시글 작성 테스트2',
    content: '게시글 작성 테스트입니다.'
    // images = 'https://...'
}
const articlePatchtest = {
    title: '게시글 수정',
    content: '수정됐어요'
}
const productTest = {
    name: '고급 그릇',
    description: '튼튼하고 좋은 그릇',
    price: 30000,
    tags: ['주방용품', '식기류']
}
const productElecTest = {
    name: '에어프라이어',
    description: '에어프라이어 없이 못살아',
    price: 100000,
    tags: ['전자제품', '가전제품', '주방가전']
}
const productPatchTest = {
    name: `청소기`,
    description: '남는 먼지 없이 한번에',
    tags: ['전자제품', '생활용품', '가전제품']
}

// Article test
async function articleTest1() {
    // test 1 게시글 작성 및 결과 확인
    console.log(await getArticleList());

    const create = await createArticle(articleTest);
    console.log(await getArticle(create.id))

    console.log(await getArticleList());
}
async function articleTest2() {
    // test 2 게시글 수정 및 결과 확인
    // 게시글 아이디 상황에 따라 수정
    const patch = await patchArticle(1667, articlePatchtest)
    console.log(await getArticle(patch.id));
    console.log(await getArticleList());
}
async function articleTest3() {
    // test 3 게시글 삭제 및 결과 확인
    // 게시글 아이디 상황에 따라 수정
    const del = await deleteArticle(1666);
    console.log(del);
    console.log(await getArticleList());
}
// Product 테스트
async function productTest1() {
    // test 1 상품 생성 및 확인
    console.log(await getProductList());

    const create = await createProduct(productElecTest);

    console.log(await getProduct(create.id));
    console.log(await getProductList());
}
async function productTest2() {
    // test 2 상품 수정 및 결과 확인
    // 상품 아이디 상황에 따라 수정
    const patch = await patchProduct(1215, productPatchTest)
    console.log(await getProduct(patch.id));
    console.log(await getProductList());
}
async function productTest3() {
    // test 3 상품 삭제 및 결과 확인
    // 상품 아이디 상황에 따라 수정
    const del = await deleteProduct(1214, productPatchTest)
    console.log(del);
    console.log(await getProductList());
}
async function productTest4() {
    // - `getProductList()`를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어 `products` 배열에 저장해 주세요.
    // - 해시태그에 “**전자제품**”이 포함되어 있는 상품들은 `Product` 클래스 대신 `ElectronicProduct` 클래스를 사용해 인스턴스를 생성해 주세요.
    // - 나머지 상품들은 모두 `Product` 클래스를 사용해 인스턴스를 생성해 주세요.

    const products = [];

    const result = await getProductList();
    for (let product of result.list) {
        if (product.tags.includes('전자제품')) {
            products.push(new ElectronicProduct(product));
        } else {
            products.push(new Product(product));
        }
    }
    console.log(`products 변수에 저장된 인스턴스의 이름 목록`);
    for (let product of products) {
        console.log(product.getName());
        if (product.getTags().includes('전자제품')) {
            console.log(product.getManufacturer())
        }
    }
}

// articleTest1();
// articleTest2();
// articleTest3();

// productTest1();
// productTest2();
// productTest3();

productTest4();
