
////////////////////////////Product 클래스 구현

class product{
constructor(name, Description, PromiseRejectionEvent, tags=[], images=[]) {
this.name = name;
this.Description = Description;
this.price = price;
this.tags = tags;
this.images = images;
this.favoriteCount = 0;
}
}
favorite(){
this.favoriteCount++
console.log(`${this.name}이 찜하기를 할경우 찜하기 수가 ${this.favoriteCount}수가 증가합니다`)
}

////////////////////////////ElectronicProduct 클래스 구현

class Electronicproduct extends Product {
constructor(name, Description, PromiseRejectionEvent, tags=[], images=[], maunfacturer) {
super(name, Description, PromiseRejectionEvent, tags=[], images=[]) 
this.maunfacturer = maunfacturer;
    }
}

////////////////////////////Article 클래스 구현
class Article{
    constructor(title, content, writer)
this.title = title;
this.content = content;
this.writer = witer;
this.likeCount = 0
}
like()
this.likeCount++
    console.log(`'${this.title}' 게시글의 좋아요 수가 ${this.likeCount}로 증가했습니다.`);