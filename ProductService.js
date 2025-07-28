import axios from 'axios';
const instance = axios.create({
    baseURL: 'https://panda-market-api-crud.vercel.app'
});

export class Product {
    #price;
    #favoriteCount;

    constructor(id, name, description, price, tags, images, favoriteCount = 0, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.#price = price;
        this.tags = tags;
        this.images = images;
        this.#favoriteCount = favoriteCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    getPrice (){
        return this.#price;
    }

    getFavoriteCount (){
        return this.#favoriteCount;
    }
    favorite() {
        return this.#favoriteCount += 1;
    }
}

export class ElectronicProduct extends Product {
    constructor(id, name, description, price, manufacturer, tags, images, createdAt, updatedAt) {
        super(id, name, description, price, tags, images, createdAt, updatedAt);
        this.manufacturer = manufacturer;
    }
}



export async function getProductlist(params = {}){
    try{
        const {page, pageSize, keyword} = params;
        const response = await instance.get('/products', {params: {page, pageSize, keyword}});
        return response.data;
    } catch (error){
        if(error){
            console.error('오류발생!')
            throw error;
        }
    }
}

export async function getProduct(id){
    try{
        const response = await instance.get('/products/${id}')
        return response. data;
    } catch (error){
        console.error (`오류 발생`); 
        throw error;
    }
}

export async function createProduct(){
    try{
        const {name, description, price, tags, images} = productListInfo;
        const response = await instance.post('/products', productListInfo);
        return response.data;
    } catch (error){
        console.error('오류 발생!')
        throw error;
    }
}


export async function patchProduct(id, productListInfo){
    try{
        const response = await instance.patch('/products/${id}', productListInfo);
        return response.data;
    } catch (error){
        console.error('오류 발생!');
        throw error;
    }
}


export async function deleteProduct(id){
    try{
        const response = await instance.delete('/products/${id}');
        return response.data;
    } catch (error){
        console.log('오류발생!');
        throw error;
    }
}

