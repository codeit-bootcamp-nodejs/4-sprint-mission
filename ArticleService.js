class Article {

    constructor(title, comment, writer, likeCount) {
        this.title = title;
        this.content = comment;
        this.writer = writer;
        this.likeCount = likeCount;
        this.createdAt = new Date();
    }

    like() {
        this.likeCount++;
    }

}

export function getArticleList(page, pageSize, keyword, orderBy = 'recent') {

    const url = new URL('https://panda-market-api-crud.vercel.app/articles');

    if (page !== undefined && !isNaN(page)) {
        url.searchParams.append('page', page);
    }

    if (pageSize !== undefined && !isNaN(pageSize)) {
        url.searchParams.append('pageSize', pageSize);
    }

    if (keyword !== undefined) {
        url.searchParams.append('keyword', `${keyword}`);
    }

    if (orderBy === 'recent' || orderBy === 'like') {
        url.searchParams.append('orderBy', `${orderBy}`);
    }

    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('응답의 상태코드가 2XX가 아닙니다');
            }
            return response.json();
        })
        .then((data) => console.log(data))
        .catch((error) => {
            console.error(error)
            throw error
        });
}

export function getArticle(articleId = undefined) {

    const url = new URL('https://panda-market-api-crud.vercel.app/articles');

    if (articleId === undefined) { // ID가 없으면 얼리리턴, swagger에서 articleId가 required 값
        console.error('articleID를 입력해주세요');
        return;
    }

    if (isNaN(articleId)) {
        console.error('articleId는 숫자를 입력해야합니다');
        return;
    }
    url.pathname += `/${articleId}`; // url paht에 articleId 추가

    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('응답의 상태코드가 2XX가 아닙니다');
            }
            return response.json();
        })
        .then((data) => console.log(data))
        .catch((error) => {
            console.error(error)
            throw error
        });

}

export function createArticle(title, content, image) {

    const url = new URL('https://panda-market-api-crud.vercel.app/articles');

    const createArticleObject = {
        title: `${title}`,
        content: `${content}`,
        image: `${image}`
    };

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(createArticleObject),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('응답의 상태코드가 2XX가 아닙니다');
            }
            return response.json();
        })
        .then((data) => console.log(data))
        .catch((error) => {
            console.error(error)
            throw error
        });

}

export function patchArticle(title, content, image, articleId = undefined) {

    const url = new URL('https://panda-market-api-crud.vercel.app/articles');

    if (articleId === undefined) { // ID가 없으면 얼리리턴, swagger에서 articleId가 required 값
        console.error('articleID를 입력해주세요');
        return;
    }

    if (isNaN(articleId)) {
        console.error('articleId는 숫자를 입력해야합니다');
        return;
    }

    url.pathname += `/${articleId}`; // url paht에 articleId 추가        

    const patchArticleObject = {
        title: `${title}`,
        content: `${content}`,
        image: `${image}`
    };

    return fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(patchArticleObject),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('응답의 상태코드가 2XX가 아닙니다');
            }
            return response.json();
        })
        .then((data) => console.log(data))
        .catch((error) => {
            console.error(error)
            throw error
        });
}

export function deleteArticle(articleId = undefined) {

    const url = new URL('https://panda-market-api-crud.vercel.app/articles');

    if (articleId === undefined) { // ID가 없으면 얼리리턴, swagger에서 articleId가 required 값
        console.error('articleID를 입력해주세요');
        return;
    }

    if (isNaN(articleId)) {
        console.error('articleId는 숫자를 입력해야합니다');
        return;
    }
    url.pathname += `/${articleId}`; // url paht에 articleId 추가

    return fetch(url, {
        method: 'DELETE'
    })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 404) {
                    console.log('존재하지 않는 게시물입니다. 404에러')
                } else {
                    throw new Error('응답의 상태코드가 2XX가 아닙니다.');
                }
            }
            return response.json();
        })
        .then((data) => console.log(data))
        .catch((error) => {
            console.error(error)
            throw error
        });

}