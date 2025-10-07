

export async function getProductList(page= 1, pageSize = 10, keyword = "") {
    const url = new URL(`https://panda-market-api-crud.vercel.app/product/`);
    try{// - `page`, `pageSize`, `keyword` 쿼리 파라미터를 이용한 get method
        url.searchParams.set("page", page);
        url.searchParams.set("pageSize",pageSize);
        url.searchParams.set("keyword",keyword);
        
        const res = await fetch(url);

        if (!res.ok) {
        // 실패한 경우 (404, 500 등)
        throw new Error(`HTTP error! 상태코드: ${res.status}`);
        }

        const data = await res.json();

        console.log("제품리스트 가져오기 성공", data);
        return data 
    }catch(err){
        console.error("제품정보 가져오기 실패", err);
    }
   
    
}


export async function getProduct() {
    const url = new URL (`https://panda-market-api-crud.vercel.app/product/`)
    try{
        
        const res = await fetch(url)
        if (!res.ok) {
        // 실패한 경우 (404, 500 등)
        throw new Error(`HTTP error! 상태코드: ${res.status}`);
        }

        const data = await res.json()// 파싱

        console.log("제품 정보 가져오기 성공", data);
        return data 
    }catch(err){
        console.error("제품 정보 가져오기 실패",err)
    }
}


export async function createProduct() {
    const url = new URL(`https://panda-market-api-crud.vercel.app/product/`)
    try{
        const res = await fetch(url,{
            method: "POST",
            headers:{
                'Content-Type' : "application/json"
            },
            body:JSON.stringify({
                name : "이름",
                description : "설명",
                price: "가격",
                tags:"태그",
                images: "사진"
            })
            
        })
        const data = await res.json();
        console.log("포스트 성공",data)
        return data 
    }catch(err){
        console.error("포스트 실패", err)
    }
}


export async function patchProduct(id, updatedData) {
    const url =new URL (`https://panda-market-api-crud.vercel.app/product/${id}`)
    try{
        const res = await fetch(url,updatedData,{
            method:"PATCH",
            headers:{
                'Content-Type' : "application/json"
            }
        })
        const data= await res.json()
        console.log("수정완료", data)
        return data
    }catch(err){
        console.error("수정 실패", err)
    }
}


export async function deleteProduct(id) {
    const url = new URL (`https://panda-market-api-crud.vercel.app/product/${id}`)
    try{
        const res = await fetch(url, {
            method: "DELETE"
        })
        const data = await res.json()
        console.log("삭제 완료", data)
        return data
    }catch(err){
         console.error("삭제 실패", err)
    }
}

/**
 * export class Article{
    constructor(title, content, writer, likeCount, date){
        this.title = title,
        this.content = content,
        this.writer = writer,
        this.likeCount =likeCount,
        this.date = date
    }
    like(){
        this.likeCount++
    }
    createdAt(){
        this.date = new this.date();// article 컨트 실행서 현재 시간날짜 저장
    }
}
 */