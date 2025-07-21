
export class Product{
    #name
    #description
    #price
    #tags
    #images
    #favoriteCount

    constructor({name,description, price, tags, images,favoriteCount}){
        this.#name = name;
        this.#description = description;
        this.#price = price;
        this.#tags = tags;
        this.#images = images;
        this.#favoriteCount = favoriteCount;
    }


    favorite(){
        this.#favoriteCount += 1;
    }

    get name(){
        return this.#name
    }
    get description(){
        return this.#description
    }
    get price(){
        return this.#price
    }
    get tags(){
        return this.#tags
    }
    get favoriteCount(){
        return this.#favoriteCount
    }

}


