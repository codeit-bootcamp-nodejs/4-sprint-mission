 import { Product } from "./ProductClass.js";


export class ElectronicProduct extends Product{

    constructor({name,description, price, tags, images, manufacturer="",favoriteCount}){
        super({name,description, price, tags , images,favoriteCount});
        this.manufacturer = manufacturer;
    }




    favorite(){
        this.favoriteCount += 1;
    }

    get name(){
        return this.name
    }
    get description(){
        return this.description
    }
    get price(){
        return this.price
    }

    //전자제품 10% 세일!
    //세일 시 price라는 getter에 polymorphism 적용!
    // get price(){
    //     price = price * 0.9
    //     this.#price = this.#price
    // }

    get tags(){
        return this.tags
    }
    
    get favoriteCount(){
        return this.favoriteCount
    }

    // 다형성 
    // 켑슐화
    // 

}
