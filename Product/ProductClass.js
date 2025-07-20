
export class Product{
    constructor({name,description, price, tags, images,}){
        this.name = name;
        this.description = description;
        this.price = price;
        this.tags = tags;
        this.images = images;
    }

    favoriteCount= 0; //수정필요

    favorite(){
        this.favoriteCount += 1;
    }
}


