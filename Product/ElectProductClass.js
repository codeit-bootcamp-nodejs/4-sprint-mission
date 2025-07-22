 import { Product } from "./ProductClass.js";


export class ElectronicProduct extends Product{

    constructor({name,description, price, tags, images, manufacturer="",favoriteCount}){
        super({name,description, price, tags , images,favoriteCount});
        this.manufacturer = manufacturer;
    }


    favorite(){
        this.favoriteCount += 1;
    }
    // 다형성 
    // 켑슐화
    // 

}
