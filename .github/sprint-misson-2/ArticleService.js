//  기본 API 주소 설정
const Base_URL = 'https://panda-market-api-crud.vercel.app';

//   게시글 리스트를 가져오는 함수 (page, pageSize, keyword 쿼리 파라미터를 이용)
export function getArticleList(params = {  page: 1, pageSize: 10, keyword: '' }) {

    //  URL 객체를 생성하여 쿼리 파라미터를 처리
    const url = new URL('${BASE_URL}/articles');

    // params 객체에서 page, pageSize, keyword 정보를 쿼리스트링에 추가
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') url.searchParams.append(key, value);
     });

     // fetch로 GET 요청 전달
     return fetch(url)
        .then(res => {
            // 응답이 실패(2XX 범위 밖)할 시, err.massage 출력한 후 err를 throw
            if (!res.ok) throw new Error('목록 조회 실패: ${res.status}');
            return res.json();
        })
        .catch(err => console.error('getArticleList 에러:', err.message));
    }

    //  getArticle() GET 메소드를 사용
    //  특정 게시글 하나를 조회하는 함수
    export function getArticle(articleId) {
        // fetch를 이용해 GET 요청 전달
        return fetch('${BASE_URL}/articles/${articleId}')
          .then(res => {
            if (!res.ok) throw new Error('게시글 조회 실패: ${res.status}');
            return res.json();
          })
          .catch(err => console.error('getArticle 에러:', err.message));
    }

    //  createArticle() POST 메소드를 사용 
    // Request Body에 title, content, image를 포함한 게시글을 생성하는 함수
    export function createArticle({ title, content, image }) {
        //  fetch로 POST 요청 전달
        return fetch('${BASE_URL}/articles', {
            method: 'POST',      // POST 메서드 사용
            headers: { 'Content-Type': 'application/json' }, // 요청에 Json 데이터를 알림.
            body: JSON.stringify({
                title,
                content,
                image,
            }),
        })
        .then(res => {
            if (!res.ok) throw new Error('생성 실패: ${res.status');
            return res.json();
        })
        .catch(err => console.error('createArticle 에러:', err.message));
    }

    // patchArticle() PARCH 메소드를 사용 
    // 게시글을 수정하는 함수
    export function patchArticle(articleId, { title, content, image }) {
        // fetch로 PATCH 요청 전달
        return fetch('${BASE_URL}/articles/${articleId}', {
            method: 'PATCH',    //  PATCH 메서드 사용
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({      //수정 내용을 JSON으로 전달
                title,
                content,
                image,
                }),
        })
        .then(res => {
            if (!res.ok) throw new Error('수정 실패: ${res.status}');
            return res.json();
        })
        .catch(err => console,error('patchArticle 에러:', err.message));
    }

    //deleteArticle() : DELETE 메소드 사용
    // 특정 게시글을 삭제하는 함수
    export function deleteArticle(articleId) {
        // fetch로 DELETE 요청 전달
        return fetch('${BASE_URL}/articles/${articleId}', {
            method: 'DELETE',       // DELETE 메서드 사용
        })
        .then(res => {
            if (!res.ok) throw new Error('삭제 실패: ${res.ststus}');
            return res.text();      //  삭제 성공 할 시 텍스트로 응답
        })
        .catch(err => console.error('deleteArticle 에러:', err.message));
    }