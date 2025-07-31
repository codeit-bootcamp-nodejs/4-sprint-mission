export class Article{
    constructor({title, content, writer, likeCount = 0, createdAt = new Date()}){
        Object.assign(this,{
            title,
            content,
            writer,
            likeCount,
            createdAt
          }
        )
    }
    like(){
        return this.likeCount += 1;
    };
    }



