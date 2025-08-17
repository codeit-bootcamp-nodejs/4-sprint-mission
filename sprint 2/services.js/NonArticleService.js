const BASE_URL = 'https://panda-market-api-crud.vercel.app';

const ArticleService = { 
    
    // 1. 게시글 목록 조회 :  getArticleList 함수
    getArticleList(params = {page : 1, pageSize: 10, keyword: ''} ) { 
        const url = new URL(`${BASE_URL}/articles`); 

        Object.keys(params).forEach((key) => { 
            if (params[key] !== undefined && params[key] !== '') { 
                url.searchParams.append(key, params[key]); 
            }
        });

        return fetch(url) 
            .then((res) => { 
                if(!res.ok) { 
                    console.error('Article 불러오기 실패! 상태코드:', res.status);
                    throw new Error ('Article 불러오기 실패!'); 
                }
                return res.json(); 
            })
            .catch((error) => { 
                console.error(error.message); 
            });
    }, 


    // 2. 게시글 상세 조회 : getArticle 함수
    getArticle(articleId) { 
        return fetch(`${BASE_URL}/articles/${articleId}`) 
            .then((res) => { 
                if (!res.ok) { 
                    console.error('Article 불러오기 실패! 상태코드:', res.status); 
                    throw new Error ('Article 불러오기 실패!'); 
                }
                return res.json();
            })
            .then((data) => { 
                return data; 
            })
            .catch((error) => { 
                console.error(error.message); 
            });
    }, 


    // 3. 게시글 생성 : createArticle 함수
    createArticle(articleData){ 
        return fetch(`${BASE_URL}/articles`, { 
            method: 'POST', 
            body: JSON.stringify({ 
                title: articleData.title,
                content: articleData.content,
                image: articleData.image,
            }), 
            headers: {
                'Content-Type': 'application/json' 
            }, 
        })
        .then((res) => { 
            if(!res.ok) { 
                console.error('Article 불러오기 실패! 상태코드:', res.status); 
                throw new Error ('Article 불러오기 실패!'); 
            } 
            return res.json();  
        })
        .catch((error) => { 
            console.error(error.message); 
        });
    },


    // 4. 게시글 수정 : patchArticle 함수
    patchArticle(articleId, articleData){ 
        return fetch(`${BASE_URL}/articles/${articleId}`, { 
            method: 'PATCH', 
            body: JSON.stringify({ 
                image: articleData.image,
                content: articleData.content,
                title: articleData.title  
            }),
            headers: { 
                'Content-Type' : 'application/json'
            },
        })
        .then((res) => { 
            if(!res.ok) {
                console.error('Article 불러오기 실패! 상태코드:', res.status); 
                throw new Error ('Article 불러오기 실패!'); 
            } 
            return res.json();  
        })
        .catch((error) => { 
            console.error(error.message);
        });
    },


    // 5. 게시글 삭제하기 : deleteArticle()
    deleteArticle(articleId) { 
        return fetch(`${BASE_URL}/articles/${articleId}`, { 
            method: 'DELETE', 
        })
        .then((res) => { 
            if(!res.ok) { 
                console.error('Article 불러오기 실패! 상태코드:', res.status); 
                throw new Error ('Article 불러오기 실패!'); 
            } 
            return res.json(); 
        })
        .catch((error) => { 
            console.error(error.message); 
        });
    }
};

export default ArticleService;
