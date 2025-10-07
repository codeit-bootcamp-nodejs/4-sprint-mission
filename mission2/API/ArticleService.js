
export async function getArticleList(page = 1, pageSize = 10, keyword = "") {// parameter page, pageSize, keyword
    const url = new URL(`https://panda-market-api-crud.vercel.app/articles/`);

    url.searchParams.set("page", page)
    url.searchParams.set("pageSize", pageSize)
    url.searchParams.set("keyword", keyword)

    axios.get(url.toString())

    .then(res => {
        console.log("GET 가사 성공", res.data)
    })
    .catch(err => {
        console.error("GET 기사 실패", err)
    })
}



export async function getArticle() {
    const url = new URL(`https://panda-market-api-crud.vercel.app/articles/`);

    axios.get(url.toString())

    .then(res => {
        console.log("GET 가사 성공", res.data)
    })
    .catch(err => {
        console.error("GET 기사 실패", err)
    })
}

export async function createArticle() {
    const url = new URL(`https://panda-market-api-crud.vercel.app/articles`);

    axios.post(url.toString(), {
        title: "제목",
        content: "내용",
        image: "이미지"
    }, {
        headers: {
            'Content-Type': "application/json"
        }
    })
    .then(res => {
        console.log("포스트 성공", res.data);
    })
    .catch(err => {
        console.error("포스트 실패", err);
    });
}





export async function patchArticle(id, updatedData) {
   const url = new URL(`https://panda-market-api-crud.vercel.app/articles/${id}`)
    axios.patch(url.toString(), updatedData, {
        headers:{
            'Content-Type' : "application/json"
        },

    })
    .then(res => {
        console.log("수정 완료", res.data)
    })
    .catch(err =>{
         console.error("수정 실패", err)
    })
}


export async function deleteArticle(id) {
    const url = new URL(`https://panda-market-api-crud.vercel.app/articles/${id}`)
    axios.delete(url.toString())
    .then(res => {
        console.log("삭제 완료", res.data)
    })
    .catch(err =>{
         console.error("삭제 실패", err)
    })
}
/// axios는  fetch대신에 axios.method(url,data)형태
// data는 생성 수정된 내용, 헤더임
