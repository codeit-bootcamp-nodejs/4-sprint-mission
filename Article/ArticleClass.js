export class Article{
    constructor({title, content, writer, likeCount=0, createdAt}){
        this.title = title;
        this.content = content ;
        this.writer = writer ;
        this.likeCount = likeCount;
        this.createdAt = new Date();
    }
    like(){
        this.likeCount += 1; 
    }
    
}