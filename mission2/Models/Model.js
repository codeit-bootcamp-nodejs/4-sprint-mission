//class for Product
export class Product{
    // parameters = name, price, tags, images, favoriteCount
    constructor(name, price, tags, images, favoriteCount){
        this.name = name, 
        this.price = price, 
        this.tags = [tags], // tag 배열
        this.images = [images], // 이미지 배열
        this.favoriteCount = favoriteCount
    }
    favorite(){
        this.favoriteCount ++
    }
    // method favorite, 호출 될 경우 + 1  
}

//class for ElectronicProduct
export class ElectronicProduct extends Product{
    constructor(name, price, tags, images, favoriteCount, manufacturer){
        // parameter = inherited from Product, add parameter manufacturer`
        super(name, price, tags, images, favoriteCount)
        this.manufacturer = manufacturer
    }
}

