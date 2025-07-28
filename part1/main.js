import { Article } from './Article.js';
import { Product, ElectronicProduct } from './Product.js';
import { getProductList } from './ProductService.js';
import * as ArticleService from './ArticleService.js';
import * as ProductService from './ProductService.js';

// 작업 1: 상품 리스트 가져오기 및 처리
async function task1() {
    console.log('=== 작업 1: 상품 리스트 처리 ===');
    
    try {
        // getProductList()를 통해 받아온 상품 리스트를 각각 인스턴스로 만들어 products 배열에 저장
        const productListData = await getProductList(1, 10, '');
        const products = [];
        
        if (productListData && productListData.list) {
            productListData.list.forEach(item => {
                // 태그에 "전자제품"이 포함된 상품들은 ElectronicProduct 클래스 인스턴스로 생성
                if (item.tags && item.tags.includes('전자제품')) {
                    const electronicProduct = new ElectronicProduct({
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        tags: item.tags,
                        images: item.images,
                        favoritesCount: item.favoritesCount || 0,
                        manufacturer: item.manufacturer || 'Unknown' // 제조사 정보
                    });
                    products.push(electronicProduct);
                    console.log('전자제품 추가:', electronicProduct.name);
                } else {
                    // 나머지 상품들은 Product 클래스 인스턴스로 생성
                    const product = new Product({
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        tags: item.tags,
                        images: item.images,
                        favoritesCount: item.favoritesCount || 0
                    });
                    products.push(product);
                    console.log('일반상품 추가:', product.name);
                }
            });
        }
        
        console.log(`총 ${products.length}개의 상품이 처리되었습니다.`);
        return products;
        
    } catch (error) {
        console.error('작업 1 실행 중 오류:', error.message);
        return [];
    }
}

// 작업 2: ArticleService와 ProductService의 모든 함수들을 테스트
async function task2() {
    console.log('=== 작업 2: 서비스 함수들 테스트 ===');
    
    try {
        // ArticleService 함수들 테스트
        console.log('--- ArticleService 테스트 ---');
        
        // 게시글 목록 가져오기
        console.log('1. 게시글 목록 가져오기:');
        await ArticleService.getArticleList({page: 1, pageSize: 5, keyword: ''});
        
        // 특정 게시글 가져오기
        console.log('2. 특정 게시글 가져오기:');
        await ArticleService.getArticle(1);
        
        // 게시글 생성
        console.log('3. 게시글 생성:');
        await ArticleService.createArticle({
            title: "테스트 게시글 제목",
            content: "테스트 게시글 내용입니다.",
            image: "https://example.com/test-image.jpg"
        });
        
        // 게시글 수정
        console.log('4. 게시글 수정:');
        await ArticleService.patchArticle(1, {
            title: "수정된 게시글 제목",
            content: "수정된 게시글 내용입니다.",
            image: "https://example.com/updated-image.jpg"
        });
        
        // 게시글 삭제
        console.log('5. 게시글 삭제:');
        await ArticleService.deleteaArticle(999); // 존재하지 않는 ID로 테스트
        
    } catch (error) {
        console.error('ArticleService 테스트 중 오류:', error.message);
    }
    
    try {
        // ProductService 함수들 테스트
        console.log('--- ProductService 테스트 ---');
        
        // 상품 목록 가져오기
        console.log('1. 상품 목록 가져오기:');
        await ProductService.getProductList(1, 5, '');
        
        // 특정 상품 가져오기
        console.log('2. 특정 상품 가져오기:');
        await ProductService.getProduct(1);
        
        // 상품 생성
        console.log('3. 상품 생성:');
        const newProductData = {
            name: "테스트 상품",
            description: "테스트용 상품입니다.",
            price: 29900,
            tags: ["테스트", "상품"],
            images: ["https://example.com/test-product.jpg"]
        };
        await ProductService.createdProduct(newProductData);
        
        // 상품 수정
        console.log('4. 상품 수정:');
        const patchData = {
            name: "수정된 상품명",
            price: 39900
        };
        await ProductService.patchProduct(1, patchData);
        
        // 상품 삭제
        console.log('5. 상품 삭제:');
        await ProductService.deleteProduct(999); // 존재하지 않는 ID로 테스트
        
    } catch (error) {
        console.error('ProductService 테스트 중 오류:', error.message);
    }
}

// 메인 실행 함수
async function main() {
    console.log(' Main.js 실행 시작');
    
    // 작업 1 실행
    const products = await task1();
    
    // 작업 2 실행  
    await task2();
    
    console.log(' 모든 작업이 완료되었습니다!');
    
    // 생성된 상품 인스턴스들 샘플 동작 테스트
    if (products.length > 0) {
        console.log('--- 상품 인스턴스 동작 테스트 ---');
        const firstProduct = products[0];
        console.log(`첫 번째 상품: ${firstProduct.name}`);
        console.log(`좋아요 수 (이전): ${firstProduct.favoritesCount}`);
        firstProduct.favorite();
        console.log(`좋아요 수 (이후): ${firstProduct.favoritesCount}`);
    }
}

// 프로그램 실행
main().catch(error => {
    console.error('메인 실행 중 오류 발생:', error);
});