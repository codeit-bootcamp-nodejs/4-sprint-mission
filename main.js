import {
  Article,
  createArticle,
} from './ArticleService.js';

function testArticleCreation() {
  const newArticle = new Article('테스트 제목', '테스트 내용', '홍길동');

  createArticle({
    title: newArticle.title,
    content: newArticle.content,
    image: 'https://via.placeholder.com/300'
  }).then((res) => {
    if (res) {
      console.log('글 생성 완료:', res); // ✅ 정상 시 응답 출력
    } else {
      console.log('글 생성 실패 (응답 없음)');
    }
  });
}

testArticleCreation();
