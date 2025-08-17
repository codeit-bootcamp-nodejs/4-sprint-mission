export class Product {
  constructor({name,description,price,tags,images}){
    this.name = name;
    this.description = description;
    this.price = price;
    this._tags = Array.isArray(tags) ? [...tags] : [];
    this._images = Array.isArray(images) ? [...images] : [];
    this.favoriteCount=0;
    }
  favorite() {
    this.favoriteCount+=1
    }
  
  get price () {
    return `가격은 ${this._price}원 입니다`;
  }
  set price(cost) {
    if(typeof(cost)==="number") {
      this._price = cost;
    } else {
      throw new Error ('숫자만 입력하세요.')
    }
  }

  get tags() {
    return [...this._tags];
  }

  get images() {
    return [...this._images];
  }
}

export class ElectronicProduct extends Product {
  constructor({name, description, price, tags, images, manufacturer= ''}) {
    super({name, description, price, tags, images})
    this.manufacturer=manufacturer;
  }
}


