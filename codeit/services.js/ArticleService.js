const BASE_URL = 'https://panda-market-api-crud.vercel.app'; // 기본이 되는 URL

const ArticleService = { 
    
// 1. 게시글 목록 조회 :  getArticleList 함수
    getArticleList(params = {page : 1, pageSize: 10, keyword: ''} ) { // 이 함수를 호출할 때, 어떤 조건으로 보여줄지 기본값& 파라미터를 설정함
        const url = new URL(`${BASE_URL}/articles`); // 기본 url에 path 주소를 추가함

        Object.keys(params) // 객체로 되어있는 params의 프로퍼티 네임(키)들을 배열로 만듦
            .forEach((key)=>{ // 배열로 만든 params의 키들을 하나씩 꺼내서 콜백 함수 실행
                if (params[key] !== undefined && params[key] !== '') { // params[key] 는 해당 키의 값 -> 값이 undefined, 빈 문자열이 아닐경우에만 동작
                    url.searchParams.append(key, params[key]); // new URL()로 만든 URL 객체 뒤에 파라미터에 들어가 있는 키와 값을 한 쌍의 쿼리 파라미터를 추가해주는 메서드
                }
            })

            return fetch(url) // 리퀘스트 보냄, promise 리턴 받기 위해 return 키워드 사용

            .then((res) => { // res는 서버로 부터 받은 리스폰스
                if(!res.ok) { // 만약 리스폰스가 200번대가 아니면
                    console.error('Article 불러오기 실패! 상태코드:', res.status) // 에러를 파라미터 안의 에러 메시지와 함께 출력. res.status는 리스폰스로 받은 상태코드를 반환함
                    throw new Error ('Article 불러오기 실패!') // 에러를 발생시키고 코드를 catch문으로 넘김
                }
            return res.json() // 이 외의 경우에는 받은 리스폰스를 파싱 (else 생략 한 것)
            })
            .catch ((error)=> { // 리퀘스트 자체를 실패한 경우 & if 문에서 넘어온 throw 문 (상태코드 200이 아닌 경우) 경우만 실행됨
                console.error (error.message) // 에러 메시지 출력
            });
    }, 


    // 2. 게시글 상세 조회 : getArticle 함수
    getArticle(articleId) { // 특정 게시글만 조회 할 수 있게 패스 파라미터 작성
            return fetch(`${BASE_URL}/articles/${articleId}`) // 특정 게시글을 리퀘스트 요청
            .then((res) => { // fetch Promise 에 리스폰스를 받으면 콜백 함수 실행
                if (!res.ok) { // 리스폰스 받은 상태코드가 200번대가 아니면 실행
                    console.error('Article 불러오기 실패! 상태코드:', res.status) // 에러를 파라미터 안의 에러 메시지와 함께 출력. res.status는 리스폰스로 받은 상태코드를 반환함
                    throw new Error ('Article 불러오기 실패!') // 에러를 발생시키고 코드를 catch문으로 넘김
                }
                return res.json() // 이 외의 경우에는 받은 리스폰스를 파싱 (else 생략 한 것)
            })
            .then((data)=> { //윗줄의 파싱된 정보를 파라미터 안 data에 넣음
                return data; // 파싱된 정보 반환
            })
            .catch ((error)=> { // 리퀘스트 자체를 실패한 경우 & if 문에서 넘어온 throw 문 (상태코드 200이 아닌 경우) 경우만 실행됨
                console.error (error.message) // 에러 메시지 출력
            })
    }, 



    // 3. 게시글 생성 : createArticle 함수
    createArticle(articleData){ // 함수 선언
        return fetch(`${BASE_URL}/articles`, { // 리퀘스트 요청 (첫번째 파라미터는 주소, 두 번짼느 옵션)
            method: 'POST', // 메소드를 POST로 설정
            body: JSON.stringify({ // 자바스크립트 객체를 JSON 문자열로 변환
                title: articleData.title,
                content: articleData.content,
                image: articleData.image,
            }), 
            headers: { // 어떤 형식의 데이터를 보내는지 
                'Content-Type': 'application/json' 
            }, 
        })
            .then((res)=> { // res 는 서버에서 받은 리스폰스
                if(!res.ok) { // 만약 리스폰스가 200번대가 아니라면 실행
                    console.error('Article 불러오기 실패! 상태코드:', res.status) // 에러를 파라미터 안의 에러 메시지와 함께 출력. res.status는 리스폰스로 받은 상태코드를 반환함
                    throw new Error ('Article 불러오기 실패!') // 에러를 발생시키고 코드를 catch문으로 넘김
                } 
                return res.json()  // 이 외의 경우에는 받은 리스폰스를 파싱 (else 생략 한 것)
            })

            .catch ((error)=> { // 리퀘스트 자체를 실패한 경우 & if 문에서 넘어온 throw 문 (상태코드 200이 아닌 경우) 경우만 실행됨
                console.error (error.message) // 에러 메시지 출력
            })
        },



    // 4. 게시글 수정 : patchArticle 함수
    patchArticle(articleId, articleData){ // 첫번째 파라미터는 어떤 게시글인지 표시, 두번째 파라미터는 고칠 내용을 표시
        return fetch(`${BASE_URL}/articles/${articleId}`, { // 특정 게시글 리퀘스트 요청
            method: 'PATCH', // 메소드 설정
            body: JSON.stringify({ // 바디 내용 (수정내용)을 JSON 문자열로 변환
                image: articleData.image,
                content: articleData.content,
                title: articleData.title  
            }),
            headers: { // 어떤 형식의 데이터를 보내는지 
                'Content-Type' : 'application/json'
            },
        })
        .then((res)=> { // res는 리스폰스
                if(!res.ok) { // 만약 200번대 리스폰스가 아니면 실행
                    console.error('Article 불러오기 실패! 상태코드:', res.status) // 에러를 파라미터 안의 에러 메시지와 함께 출력. res.status는 리스폰스로 받은 상태코드를 반환함
                    throw new Error ('Article 불러오기 실패!') // 에러를 발생시키고 코드를 catch문으로 넘김
                } 
                return res.json()  // 이 외의 경우에는 받은 리스폰스를 파싱 (else 생략 한 것)
            })

            .catch ((error)=> { // 리퀘스트 자체를 실패한 경우 & if 문에서 넘어온 throw 문 (상태코드 200이 아닌 경우) 경우만 실행됨
                console.error (error.message)
            })
        },

    //5. 게시글 삭제하기 : deleteArticle()
    deleteArticle(articleId) { // 삭제할 특정 게시글을 파라미터에 넣음
        return fetch(`${BASE_URL}/articles/${articleId}`, { // 첫번째 파라미터는 특정 게시글을 리퀘스트,두번째 파라미터는 옵션
            method: 'DELETE', // 메소드 정보
        })
        
        .then((res) => { // 서버에서 리스폰스 받음
            if(!res.ok) { // 만약 200번대 상태코드 아니면 실행
                    console.error('Article 불러오기 실패! 상태코드:', res.status) // 에러를 파라미터 안의 에러 메시지와 함께 출력. res.status는 리스폰스로 받은 상태코드를 반환함
                    throw new Error ('Article 불러오기 실패!') // 에러를 발생시키고 코드를 catch문으로 넘김
                } 
            return res.json() // 이 외의 경우에는 받은 리스폰스를 파싱 (else 생략 한 것)
        })
        .catch ((error)=> { // 리퀘스트 자체를 실패한 경우 & if 문에서 넘어온 throw 문 (상태코드 200이 아닌 경우) 경우만 실행됨
                console.error (error.message) // 에러 메시지 출력
            })
    }
    
};

export default ArticleService;
