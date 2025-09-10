// Product 클래스 정의
export class Product {
  constructor(name, description, price, tags, images) {
    this.name = name;               // 상품명
    this.description = description; // 상품 설명
    this.price = price;             // 판매 가격
    this.tags = tags;               // 해시태그 배열
    this.images = images;           // 이미지 배열
    this.favoriteCount = 0;         // 찜하기 수 초기값
  }

  // favorite 메서드: 찜하기 수 1 증가
  favorite() {
    this.favoriteCount += 1;
  }
}
