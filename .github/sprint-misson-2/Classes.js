// 상품 클래스 정의
export class Product {
    //  상품 정보 객체 속성 세팅
    constructor(name, description, price, tags = [], images = []) {
        this.name = name;  //상품명
        this.description = description;    //상품 설명
        this.price = price;    //상품 가격
        this.tags = tags;  //상품 해시태그 배열
        this.images = images;  //상품 이미지 배열
        this.favorite = 0;    //찜하기 수 (초기값 0)
    }


//  favorite 메서드 찜하기 수를 1씩 증가
favorite () {
    this.favoriteCount += 1;    //favoriteCount 값을 1씩 증가
}
}

//  Product를 상속하는 ElectronicProduct 클래스
export class ElectronicProduct extends Product {
    constructor(name, description, price, tags = [], images = [], manufacturer = '')
    {
        super(name, description, price, tags, images); //   product 속성 
        this.manufacturer = manufacturer; // 제조사 정보 추가 저장
    }
}

//  게시글 클레스 정의 Article 클래스
export class Article {
    // 게시글 정보 객체 속성 
    constructor(title, content, writer) {
        this.title = title;          //  게시글 제목
        this.content = content;     //  게시글 내용
        this.writer = writer;       //  작성자 이름
        this.likeCount = 0;         //  좋아요 수 (초기값 0)
        this.createdAt = new Date();    //  객체 생성 시점 현재시간 저장
    }

    //  좋아요 수 1씩 증가시키는 like 메서드
    like() {
        this.likeCount += 1;    //  호출 할 경우 likeCount가 1 증가
    }
}