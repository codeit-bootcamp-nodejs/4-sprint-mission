// 상품을 나타내는 Product 클래스(설계도)
export class Product {
  // 생성자: 상품의 기본 정보들을 받아서 객체를 초기화함
  constructor({ name, description, price, tags, images, favoriteCount = 0 }) {
    this.name = name; // 상품명 저장
    this.description = description; // 상품 설명 저장
    this.price = price; // 판매 가격 저장
    this.tags = tags || []; // 해시태그(배열), 없으면 빈 배열로 저장
    this.images = images || []; // 상품 이미지(배열), 없으면 빈 배열로 저장
    this.favoriteCount = favoriteCount; // 찜하기 수, 기본값 0
  }
  // favorite() 메서드: 찜하기 수를 1 증가시킴
  favorite() {
    this.favoriteCount += 1;
  }
}

// 전자제품을 위한 ElectronicProduct 클래스 (Product 상속)
export class ElectronicProduct extends Product {
  // 생성자: manufacturer(제조사)와 나머지 상품 정보(rest)를 받아 초기화
  constructor({ manufacturer, ...rest }) {
    super(rest); // Product(부모 클래스)의 생성자에 나머지 정보 전달
    this.manufacturer = manufacturer || '알 수 없음'; // 제조사 정보, 없으면 '알 수 없음'으로 저장
  }
}

// Product API 함수
const BASE_URL = 'https://panda-market-api-crud.vercel.app/api/products';

// 상품 목록을 불러오는 비동기 함수 (API GET 요청)
export async function getProductList({
  page = 1,
  pageSize = 10,
  keyword = '',
} = {}) {
  try {
    // 요청 URL을 page, pageSize, keyword 쿼리파라미터로 구성
    const url = `${BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`;
    // fetch로 API GET 요청, 응답을 기다림
    const res = await fetch(url);
    // 응답이 실패(2xx 아님)면 에러 발생시킴
    if (!res.ok) throw new Error(`상품 리스트 조회 실패: ${res.status}`);
    // 응답 본문을 JSON으로 파싱해서, products만 구조분해 할당
    const { products } = await res.json();

    // products 배열을 돌면서 Product/ElectronicProduct 인스턴스로 변환해서 새 배열로 반환
    return products.map((prod) => {
      // 상품의 해시태그에 "전자제품"이 포함되어 있으면 ElectronicProduct(전자제품)으로 생성
      if (prod.tags && prod.tags.includes('전자제품')) {
        return new ElectronicProduct(prod);
      }
      // 그 외 상품은 Product(일반 상품) 클래스로 생성
      return new Product(prod);
    });
  } catch (e) {
    // 에러 발생 시 에러 메시지를 콘솔에 출력
    console.error(e.message);
    // 실패 시 빈 배열 반환
    return [];
  }
}

// 특정 상품 1개를 불러오는 비동기 함수
export async function getProduct(id) {
  try {
    // 상품 id를 이용해 해당 상품 API에 GET 요청
    const res = await fetch(`${BASE_URL}/${id}`);
    // 응답 코드가 2xx(성공)가 아니면 에러 발생
    if (!res.ok) throw new Error(`상품 조회 실패: ${res.status}`);
    // 성공 시, 응답 본문을 JSON으로 변환해 반환
    return await res.json();
  } catch (e) {
    // 실패(에러) 시, 에러 메시지를 콘솔에 출력
    console.error(e.message);
    // 실패한 경우 null 반환 (실패 신호)
    return null;
  }
}

// 상품을 새로 등록(생성)하는 비동기 함수
export async function createProduct({
  name,
  description,
  price,
  tags = [],
  images = [],
}) {
  try {
    // API에 POST 요청으로 상품 정보 전달
    const res = await fetch(BASE_URL, {
      method: 'POST', // HTTP 메서드: POST(생성)
      headers: { 'Content-Type': 'application/json' }, // 요청 타입: JSON
      body: JSON.stringify({ name, description, price, tags, images }), // 상품 정보를 JSON 문자열로 변환해서 보냄
    });
    // 응답 코드가 2xx(성공)가 아니면 에러 발생
    if (!res.ok) throw new Error(`상품 생성 실패: ${res.status}`);
    return await res.json();
  } catch (e) {
    // 에러 발생 시 콘솔에 에러 메시지 출력
    console.error(e.message);
    // 실패한 경우 null 반환
    return null;
  }
}

// 특정 상품 정보를 수정하는 비동기 함수 (PATCH 요청)
export async function patchProduct(id, data) {
  try {
    // 해당 상품 id로 PATCH 요청 (수정할 데이터 전달)
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH', // HTTP 메서드: PATCH(부분 수정)
      headers: { 'Content-Type': 'application/json' }, // 요청 타입: JSON
      body: JSON.stringify(data), // 수정할 내용을 JSON 문자열로 변환해서 보냄
    });
    // 응답이 성공(2xx)이 아니면 에러 발생
    if (!res.ok) throw new Error(`상품 수정 실패: ${res.status}`);
    // 성공하면, 수정된 상품 데이터를 JSON으로 반환
    return await res.json();
  } catch (e) {
    // 에러 발생 시 콘솔에 에러 메시지 출력
    console.error(e.message);
    // 실패 시 null 반환
    return null;
  }
}

// 특정 상품을 삭제하는 비동기 함수 (DELETE 요청)
export async function deleteProduct(id) {
  try {
    // 상품 id로 DELETE 요청(삭제)
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    // 응답이 성공(2xx)이 아니면 에러 발생
    if (!res.ok) throw new Error(`상품 삭제 실패: ${res.status}`);
    // 성공 시 true 반환(삭제 성공 신호)
    return true;
  } catch (e) {
    // 에러 발생 시 메시지 콘솔에 출력
    console.error(e.message);
    // 실패 시 false 반환(삭제 실패 신호)
    return false;
  }
}
