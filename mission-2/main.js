import { getArticle, getArticleList, createArticle, patchArticle, deleteArticle } from "./ArticleService.js";
import { getProduct, getProductList, createProduct, patchProduct, deleteProduct } from "./ProductService.js";
import Article from "./Article.js";
import Product from "./Product.js";
import ElectronicProduct from "./ElectronicProduct.js";
import assert from 'node:assert/strict';

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
    const articleList = await getArticleList();
    assert.ok(articleList, '게시글 목록을 불러오지 못했습니다.');

    const {id} = await createArticle(articleTest);
    const article = await getArticle(id)
    assert.ok(article, '게시글을 불러오지 못했습니다.');

    const listAfter = await getArticleList();
    assert.strictEqual(listAfter.list.length, articleList.list.length + 1, '상품 개수가 1개 늘어나야 합니다.');

    console.log('test 1 통과')
}
async function articleTest2() {
    // test 2 게시글 수정 및 결과 확인
    // 게시글 아이디 상황에 따라 수정
    const {id} = await patchArticle(1667, articlePatchtest);
    assert.ok(id, '수정된 게시글에는 id가 있어야 합니다');

    const fetched = await getArticle(id);
    assert.strictEqual(fetched.title, articlePatchtest.title, '수정된 제목이 일치하지 않습니다');
    assert.strictEqual(fetched.content, articlePatchtest.content, '수정된 내용이 일치하지 않습니다');

    const list = await getArticleList();
    const exists = list.list.some(article => article.id === id);
    assert.ok(exists, '수정된 게시글이 목록에 존재하지 않습니다');

    console.log('test2 통과');
}
async function articleTest3() {
    // test 3 게시글 삭제 및 결과 확인
    const targetId = 1666; // 상황에 맞게 수정 필요

    // 게시글 삭제
    const del = await deleteArticle(targetId);
    assert.ok(del.success, '게시글 삭제가 실패했습니다');

    // 삭제 후 목록 확인
    const list = await getArticleList();
    const exists = list.list.some(article => article.id === targetId);
    assert.ok(!exists, '삭제된 게시글이 여전히 목록에 존재합니다');

    console.log('test3 통과');
}
// Product 테스트
async function productTest1() {
    // test 1 상품 생성 및 확인
    const listBefore = await getProductList();
    const beforeLength = listBefore.list.length;

    const {id} = await createProduct(productElecTest);
    assert.ok(id, '생성된 상품에는 id가 있어야 합니다');

    const fetched = await getProduct(id);
    assert.strictEqual(fetched.name, productElecTest.name, '상품명이 일치하지 않습니다');
    assert.strictEqual(fetched.description, productElecTest.description, '상품 설명이 일치하지 않습니다');
    assert.strictEqual(fetched.price, productElecTest.price, '상품 가격이 일치하지 않습니다');
    assert.deepStrictEqual(fetched.tags, productElecTest.tags, '상품 태그가 일치하지 않습니다');

    const listAfter = await getProductList();
    assert.strictEqual(listAfter.list.length,beforeLength + 1,
        '상품 생성 후 목록 개수가 1개 증가해야 합니다'
    );

    const exists = listAfter.list.some(product => product.id === id);
    assert.ok(exists, '생성된 상품이 목록에 존재하지 않습니다');

    console.log('test1 통과');
}
async function productTest2() {
    // test 2 상품 수정 및 결과 확인
    const targetId = 1215; // 상황에 맞게 수정

    const {id} = await patchProduct(targetId, productPatchTest);
    assert.ok(id, '수정된 상품에는 id가 있어야 합니다');

    const fetched = await getProduct(id);
    assert.strictEqual(fetched.name, productPatchTest.name, '수정된 상품 이름이 일치하지 않습니다');
    assert.strictEqual(fetched.description, productPatchTest.description, '수정된 상품 설명이 일치하지 않습니다');
    assert.deepStrictEqual(fetched.tags, productPatchTest.tags, '수정된 상품 태그가 일치하지 않습니다');

    const list = await getProductList();
    const exists = list.list.some(product => product.id === id);
    assert.ok(exists, '수정된 상품이 목록에 존재하지 않습니다');

    console.log('test2 통과');
}
async function productTest3() {
    // test 3 상품 삭제 및 결과 확인
    const targetId = 1214; // 상황에 따라 삭제 대상 ID 수정 필요

    // 삭제 실행
    const del = await deleteProduct(targetId);
    assert.ok(del, '상품 삭제가 실패했습니다'); 

    // 삭제 후 목록 확인
    const list = await getProductList();
    const exists = list.list.some(product => product.id === targetId);
    assert.ok(!exists, '삭제된 상품이 여전히 목록에 존재합니다');

    console.log('test3 통과');
}
async function productTest4() {
    // - `getProductList()`를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어 `products` 배열에 저장해 주세요.
    // - 해시태그에 “**전자제품**”이 포함되어 있는 상품들은 `Product` 클래스 대신 `ElectronicProduct` 클래스를 사용해 인스턴스를 생성해 주세요.
    // - 나머지 상품들은 모두 `Product` 클래스를 사용해 인스턴스를 생성해 주세요.

    const products = [];

    const result = await getProductList();
    for (let product of result.list) {
        if (product.tags.includes('전자제품')) {
            const ep = new ElectronicProduct(product);
            assert.ok(ep instanceof ElectronicProduct, '전자제품 태그 상품은 ElectronicProduct 인스턴스여야 합니다');
            products.push(ep);
        } else {
            const p = new Product(product);
            assert.ok(p instanceof Product, '일반 상품은 Product 인스턴스여야 합니다');
            products.push(p);
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

async function tests(){
    try{
        await articleTest1();
        await articleTest2();
        await articleTest3();

        await productTest1();
        await productTest2();
        await productTest3();
        await productTest4();
        console.log('모든 테스트 완료!');
    }catch(e){
        console.error(e)
    }
}


tests();
