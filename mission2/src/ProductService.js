 //getProductList
 export async function getProductList(params) {
     const url = new URL(`https://panda-market-api-crud.vercel.app/products`);
     Object.keys(params).forEach((key) =>
         url.searchParams.append(key, params[key])
     );

     const res = await fetch(url);
     const data = await res.json();
     return data;
 }

 //getProduct
 export async function getProduct() {
     const res = await fetch (`https://panda-market-api-crud.vercel.app/products`);
     const data = await res.json();
     return data;
 }

 //createProduct
 export async function createProduct(productData) {
     const res = await fetch (`https://panda-market-api-crud.vercel.app/products`, {
     method: 'POST',
     body: JSON.stringify(productData),
     headers: {
         'Content-Type': 'application/json',
     },
   });

   const data = await res.json();
   return data;
 }

 //patchProduct
 export async function patchProduct(id, productData) {
     const res = await fetch(`https://panda-market-api-crud.vercel.app/products/${id}`, {
         method: 'PATCH',
         body: JSON.stringify(productData),
         headers: {
             'Content-Type': 'application/json'
         },
     });
     const data = await res.json();
     return data;
 }

 //deleteProduct
 export async function deleteProduct(id) {
     const res = await fetch(`https://panda-market-api-crud.vercel.app/products/${id}`, {
         method: 'DELETE',
     });
     const data = await res.json();
     return data;
 }

 //비동기, 오류 처리
 export async function checkProduct(id) {
   const res = await fetch(`https://panda-market-api-crud.vercel.app/products/${id}`);

   if (!res.ok) {
     throw new Error('데이터를 불러오는데 실패했습니다.');
   }

   const data = await res.json();
   return data;
 }

 export async function createProducts(productData) {
     let res;
     try {
         res = await fetch (`https://panda-market-api-crud.vercel.app/products`, {
             method: 'POST',
             body: JSON.stringify(productData),
             headers: {
                 'Content-Type': 'application/json',
             },
         });
     } catch (error) {
         console.error(error);
         throw new Error('네트워크 전송 중 오류 발생');
     }

     if (!res.ok) {
         throw new Error('네트워크 전송 중 오류 발생');
     }

     let data;
     try {
         data = await res.json();
     } catch (error) {
         console.error(error);
         throw new Error('JSON 피싱 중 오류 발생');
     }
     return data;
 }
