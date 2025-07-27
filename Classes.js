// Product.js
class Product {
    constructor(name, description, price, tags = [], images = []){
        this._name = name; //상품명
        this._description = description; //상품설명
        this._price = price; //가격
        this._tags = tags; //해시태그 배열
        this._images = images; //이미지 배열
        this._favorite = 0; //찜하기 수 (시작 0)
    }
} 

//  name 속성 읽기(gatter)
get name(); {
    return this._name;
}