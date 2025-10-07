export class Article{
    constructor(title, content, writer, likeCount, date){
        this.title = title,
        this.content = content,
        this.writer = writer,
        this.likeCount =likeCount,
        this.date = date
    }
    like(){// method like
        this.likeCount++ // article 컨트 호출시 1씩 증가
    }
    createdAt(){
        this.date = new Date();// article 컨트 실행서 현재 시간날짜 저장
    }
}