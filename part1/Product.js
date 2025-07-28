export class Product{
    constructor({name, description, price, tags, images, favoritesCount = 0}){
        Object.assign(this, {//this: name, value: 아래
            name,
            description,
            price,
            tags,
            images,
            favoritesCount
        });
    }
    favorite(){
        return this.favoritesCount += 1;
    };
}
//Q: 매개변수 깔끔하게 따오는 방법?? 뭔가 객체 전체를 값하나에 할당하고 싶은데
export class ElectronicProduct extends Product {
    constructor({name, description, price, tags, images, favoritesCount = 0,manufacturer}){
        super(name, description, price, tags, images, favoritesCount);
        this.manufacturer = manufacturer //Q파라미터 객체인데 바로접근해도되는지?
    }
}

