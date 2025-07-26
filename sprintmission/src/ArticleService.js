//여기선 편의대로 생성자 매개변수를 편하게 써넣었는데,
//메소드 자동 완성에서 매개변수를 확인하면 의미를 알기 어려우니까
//현업에선 열심히 매개변수 단어 다 써주기

class Article {
    title = '';
    content = '';
    writer = '';
    likeCount = 0;
    createAt = '';

    constructor(createAt) {
        this.createAt = createAt;
    }

    like() {
        this.likeCount++;
    }
}

const link = 'https://panda-market-api-crud.vercel.app/articles';
const url = new URL(link);

export function getArticleList() {
    let address = url;
    address.searchParams.append('page', 1);
    address.searchParams.append('pageSize', 10);
    address.searchParams.append('keyword', '');

    let result = fetch(address)
    .then((res) => {
        if(!(res.status >= 200 && res.status < 300)) console.error("응답 코드 에러 : " + res.status);
        return res.json();
    })
    .then((json) => {
        console.log(json);
        return json;
    })
    .catch((e) => {
        console.error("에러 발생 : " + e);
    })

    return result;
}

export function getArticle() {
    let address = url;
    address.searchParams.append('articleId', 10);

    let result = fetch(address)
    .then((res) => {
        if(!(res.status >= 200 && res.status < 300)) console.error("응답 코드 에러 : " + res.status);
        return res.json();
    })
    .then((json) => {
        console.log(json);
        return json;
    })
    .catch((e) => {
        console.error("에러 발생 : " + e);
    })

    return result;
}

export function createArticle() {
    fetch(url.toString(), {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image: "https://example.com/...",
            content: "게시글 내용입니다.",
            title: "게시글 제목입니다."
        }),
    })
        .then((res) => {
        if(!(res.status >= 200 && res.status < 300)) console.error("응답 코드 에러 : " + res.status);
        return res.json();
    })
    .then((json) => {
        console.log(json);
        return json;
    })
    .catch((e) => {
        console.error("에러 발생 : " + e);
    })
}

export function patchArticle() {
    let address = url;
    address.searchParams.append('articleId', 1);

    fetch(address, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image: "https://example.com/...",
            content: "게시글 내용입니다.",
            title: "게시글 제목입니다."
        }),
    })
        .then((res) => {
        if(!(res.status >= 200 && res.status < 300)) console.error("응답 코드 에러 : " + res.status);
        return res.json();
    })
    .then((json) => {
        console.log(json);
        return json;
    })
    .catch((e) => {
        console.error("에러 발생 : " + e);
    })
}

export function deleteArticle() {
    let address = url;
    address.searchParams.append('articleId', 1);

    fetch(address, {
        method: "DELETE",
    })
        .then((res) => {
        if(!(res.status >= 200 && res.status < 300)) console.error("응답 코드 에러 : " + res.status);
        return res.json();
    })
    .then((json) => {
        console.log(json);
        return json;
    })
    .catch((e) => {
        console.error("에러 발생 : " + e);
    })
}

