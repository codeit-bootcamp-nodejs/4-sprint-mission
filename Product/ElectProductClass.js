 import { Product } from "./ProductClass.js";


export class ElectronicProduct extends Product{
    favoriteCount = 0;
    constructor({name,description, price, tags, images,manufacturer=""}){
        super({name,description, price, tags , images});
        this.manufacturer = manufacturer;
    }

    // 다형성 
    // 켑슐화
    // 
}
