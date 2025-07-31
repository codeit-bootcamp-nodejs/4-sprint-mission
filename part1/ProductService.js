
const baseURL = new URL('https://panda-market-api-crud.vercel.app') 

export async function getProductList(page, pageSize, keyword){
    baseURL.pathname += '/products'
    baseURL.searchParams.append('page',page);
    baseURL.searchParams.append('pageSize',pageSize);
    baseURL.searchParams.append('keyword',keyword);
    try{
    const res = await fetch(baseURL)
    if(!res.ok){
        console.log(`Error!! 목록 찾기에 실패하였습니다! status: ${res.sutats}`)
        throw new Error('Error!! 목록 찾기에 실패하였습니다!')
    }
    const data = await res.json()
    console.log(data);
    return data;} catch {
        console.log(e.message)
        throw e
    }    
}

//Test
//getProductList(1, 10, "")

export async function getProduct(id){
    baseURL.pathname += `/products/${id}`
    try{
    const res = await fetch(baseURL)
    if(!res.ok){
        console.log(`Status: ${res.message}`)
        throw Error("Error!! 상품을 찾을 수 없습니다");
    } else {
    const data = await res.json()
    console.log(data);
    return data;
    }
    } catch (e) {
        console.log(e.message)
        throw e; //외부에서 함수 호출시 함수의 결과 값을전달.
    }
}    

//Test: 2xx 아닐 때 에러처리 다시 생각해보기
//getProduct(1)

export async function createdProduct(productData){
    baseURL.pathname += `/products/`
    try{
        const res = await fetch(baseURL, {
        method: "POST",
        body: JSON.stringify(productData),
        headers: {
             'content-type': 'application/json', 
        }
    })
        if(!res.ok){
            console.log(`Error!! 상품 생성에 실패했습니다. Status: ${res.status}`);
            throw new Error("Error!! 상품 생성에 실패했습니다");
        }     
        const data = await res.json()
        console.log(data)
        return data
        } catch (e) {
            console.log(e.message)
            throw e;
        }
}  
//Test
// const productData = {
//         name: "상품이름",
//         description: "string",
//         price: 0,
//         tags: "전자제품",
//         images: "https://example.com/..."
//     }
//createdProduct(productData)

export async function patchProduct(id, patchData){
    baseURL.pathname += `/products/${id}`
    try{
        const res = await fetch(baseURL,{
        method: "PATCH",
        body: JSON.stringify(patchData),
        headers: {
            'content-type': 'application/json',
        }
    })
        if(!res.ok){
        console.log(`Error!! 패치에 실패했습니다. status: ${res.status}`)
        throw new Error("Error!! 패치에 실패했습니다.")
        }
        const data = await res.json()
        console.log(data)
        return data
        } catch (e) {
            console.log(e.messgae)
            throw e;
        }
}

export async function deleteProduct(id){
    baseURL.pathname =+ `/products/${id}`
    try{
        const res = await fetch(baseURL,{
            moethod: 'DELETE',
            //아래부분 필요한가? 확인
            body: JSON.stringify(patchData),
            headers: {
            'content-type': 'application/json',
        }
        })
        if(!res.ok){
            console.log(`Error!! 삭제에 실패했습니다. status: ${res.status}`)
            throw new Error('Error!! 삭제에 실패했습니다')
        }
        const data = await res.jsoin()
        console.log(data)
        return data
    } catch (e){
        console.log(e.messgae)
        throw e;
    }
}