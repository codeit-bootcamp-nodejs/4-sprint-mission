const BASE_URL = 'https:// panda-market=api-crud.vercel.app/articles';

export function getArticleList(params={}){
    const url = new URL(BASE_URL)
    Object.keys(params).forEach(key =>
        url.searchParams.append(key,params[key]));
    return fetch (BASE_URL)
    .then(res => {
        if(!res.ok){
        throw new Error('게시글을 가져오지 못했습니다.')
        }
        return res.json();
    })
    .catch ((error) => { 
        console.error(error)
        throw error;
    });
}

export function createArticle(articleData){
    return fetch(BASE_URL,{
        method: 'POST',
        body: JSON.stringify(articleData),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(res => {
        if(!res.ok){
        throw new Error ('게시글 생성에 실패했습니다.')
        }
        return res.json()
    })
    .catch (error => { 
        console.error(error);
        throw error;
    });
}

export function patchArticle (id, updatedData){
    return fetch(`BASE_URL/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
    })
    .then(res => {
        if(!res.ok){
            throw new Error('게시글 수정 오류 발생')
        }
        return res.json()
    })
    .catch(error => {
        console.error(error)
        throw error;
    });
}

export function deleteArticle(id){
    return fetch(`BASE_URL/${id}`, {
        method: 'DELETE',
    })
    .then(res => {
        if(!res.ok){
        throw new Error('게시글 삭제 오류 발생')
        }
        return res.json()
    })
    .catch(error => {
        console.error(error)
        throw error
    });
}