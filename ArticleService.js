## Article 요청 함수 구현하기

// 기본 URL 설정
const BASE_URL = ''; // 실제 API URL로 변경하세요

// 1. 게시글 목록 조회
export function getArticleList(page = 1, pageSize = 10, keyword = '') {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        keyword: keyword
    });

    return fetch(`${BASE_URL}/articles?${queryParams}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('게시글 목록 조회 성공:', data);
        return data;
    })
    .catch(error => {
        console.error('게시글 목록 조회 실패:', error);
        throw error;
    });
}

// 2. 특정 게시글 조회
function getArticle(articleId) {
    return fetch(`${BASE_URL}/articles/${articleId}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('게시글 조회 성공:', data);
        return data;
    })
    .catch(error => {
        console.error('게시글 조회 실패:', error);
        throw error;
    });
}

// 3. 게시글 생성
function createArticle(title, content, image) {
    const requestBody = {
        title: title,
        content: content,
        image: image
    };

    return fetch(`${BASE_URL}/articles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('게시글 생성 성공:', data);
        return data;
    })
    .catch(error => {
        console.error('게시글 생성 실패:', error);
        throw error;
    });
}

// 4. 게시글 수정
function patchArticle(articleId, updateData) {
    return fetch(`${BASE_URL}/articles/${articleId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    })
    .then(response => {
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('게시글 수정 성공:', data);
        return data;
    })
    .catch(error => {
        console.error('게시글 수정 실패:', error);
        throw error;
    });
}

// 5. 게시글 삭제
function deleteArticle(articleId) {
    return fetch(`${BASE_URL}/articles/${articleId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('게시글 삭제 성공:', data);
        return data;
    })
    .catch(error => {
        console.error('게시글 삭제 실패:', error);
        throw error;
    });
}