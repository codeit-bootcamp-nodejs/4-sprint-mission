export class ElectronicProduct extends Product {
    
    constructor(name, description, price, tags, images, favoriteCount,manufacturer){
        super(name, description, price, tags, images, favoriteCount);
        this.manufacturer = manufacturer;
    };
}