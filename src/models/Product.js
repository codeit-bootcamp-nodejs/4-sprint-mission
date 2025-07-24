// Product 클래스는 상품정보와 찜하기 기능을 구현한다.
export class Product {
  
  constructor(name, description, price, tags=[], images=[]) {
    this._name = name;
    this._description = description;
    this._price = price;
    this._tags = tags;    // 배열
    this._images = images;    // 배열
    this._favoriteCount = 0;
  }
  
  set name(name) {
    this._name = name;  
  }
  get name() {
    return this._name;
  }

  set description(value) {
    this._description = value;
  }
  get description() {
    return this._description;
  }

  set price(value) {
    this._price = value;
  }
  get price() {
    return this._price;
  }

  set tag(value) {
    this._tags = value;
  }
  get tag() {
    return this._tags;
  }

  set images(value) {
    this._images = value;
  }
  get images() {
    return this._images;
  }

  set favoriteCount(value) {
    this._favoriteCount = value;
  }
  get favoriteCount() {
    return this._favoriteCount;
  }

  favorite() {
    this._favoriteCount++;
  }
  getInfo() {
    return `[상품] ${this.name} ${this.price}원`;
  }

}


// ElectronicProduct 클래스는 Product클래스를 상속한다. 제조사 정보를 추가한다.
export class ElectronicProduct extends Product {
  
  constructor(name, description, price, tags=[], images=[], favoriteCount=0, manufacturer) {
    super(name, description, price, tags, images, favoriteCount);
    this._manufacturer = manufacturer;
  }

  set manufacturer(value) {
    this._manufacturer = value;
  }
  get manufacturer() {
    return this._manufacturer;
  }
// 오버라이딩 구현(다형성)
  getInfo() {
    return `[전자제품] ${this.name} ${this.manufacturer} ${this.price}원`;
  }
}