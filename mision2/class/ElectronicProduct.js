// ElectronicProduct 클래스 정의 (Product 상속)

import {Product} from './Product.js';

class ElectronicProduct extends Product {
  constructor(name, description, price, tags, images, manufacturer) {
    super(name, description, price, tags, images); // 부모 생성자 호출
    this.manufacturer = manufacturer;              // 제조사
  }
}
// 필요시 export
export default ElectronicProduct;