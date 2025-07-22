import axios from 'axios'


let url = 'https://panda-market-api-crud.vercel.app/products'

export async function getProductList(page=1, pageSize=10, keyword=""){
    try{
        let response = await axios.get(url,
            {params: {
                page : page,
                pageSize : pageSize,
                keyword : keyword
            }});
        return response.data;
    }catch(error){
        console.error(error);
    }
}

    

export async function getProduct(){
    try{
        await axios.get(url);
    }catch(error){
        console.error(error);
    }
}

export async function createProduct({name="",description="",price=0, tags="",images=""}){
    try{
        await axios.post(url,{
            'name' : name,
            'description' : description,
            'price' : price,
            'tags' : tags,
            'images' : images
        });
    }catch(error){
        console.error(error);
    }

}

export async function patchProduct({name, description, price,tags,images},productId){
    url= `https://panda-market-api-crud.vercel.app/products/${productId}`
    try{
        await axios.patch(url,{
            'name': name,
            'description': description,
            'price': price,
            'tags':tags,
            'images':images
        }
        )
    }catch(error){
        console.error(error);
    }
}

export async function deleteProduct(){
    try{
        await axios.delete(url)
    }catch(error){
        console.error(error);
    }
}
