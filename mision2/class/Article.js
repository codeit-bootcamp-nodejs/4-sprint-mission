class Article {
  // likeCount를 private 필드로 선언
  #likeCount;

  constructor(title, content, writer) {
    this.title = title;               // 제목
    this.content = content;           // 내용
    this.writer = writer;             // 작성자
    this.#likeCount = 0;              // 좋아요 수 (비공개)
    this.createdAt = new Date();      // 생성일자 (현재 시간)
  }

  // 좋아요 수 1 증가
  like() {
    this.#likeCount += 1;
  }

  // getter: 외부에서 likeCount 읽기 허용
  get likeCount() {
    return this.#likeCount;
  }

  // setter: 외부에서 likeCount 직접 수정 제한하거나 로직 삽입 가능
  set likeCount(value) {
    console.warn("likeCount는 직접 수정할 수 없습니다. like() 메서드를 사용하세요.");
  }
}
