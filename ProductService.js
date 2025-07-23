class Product {

    constructor(name, description, price, [tags], [images], favoriteCount) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.tags = [tags];
        this.images = [images];
        this.favoriteCount = favoriteCount;

    }

    favorite() {
        this.favoriteCount++;
    }
}

class ElectronicProduct extends Product {

    constructor(name, description, price, [tags], [images], favoriteCount, manufacturer) {
        super(name, description, price, [tags], [images], favoriteCount);
        this.manufacturer = manufacturer;
    }

    favorite() {
        this.favoriteCount++;
    }
}

export async function getProductList(page, pageSize, keyword, orderBy = 'recent') {

    const url = new URL('https://panda-market-api-crud.vercel.app/products');

    // 파라미터의 조건 확인
    if(page !== undefined && !isNaN(page)) {
        url.searchParams.append('page', page);
    }

    if(pageSize !== undefined && !isNaN(pageSize)) {
        url.searchParams.append('pageSize', pageSize);
    }
    
    if(keyword !== undefined) {
        url.searchParams.append('keyword', `${keyword}`);
    }
    
    if(orderBy === 'recent' || orderBy === 'favorite') {
        url.searchParams.append('orderBy', `${orderBy}`);
    }

    let productList = [];

    try {
        const res = await fetch(url);
        const data = await res.json();
        for(const productProperty of data.list) {
            const{id, name, description, price, tags, images, favoriteCount, manufacturer} = productProperty;
            if(tags.includes('전자제품')) {
                const productElement = new ElectronicProduct(name, description, price, tags, images, favoriteCount, manufacturer);
                productList.push(productElement);
            } else {
                const productElement = new Product(name, description, price, tags, images, favoriteCount, manufacturer);
                productList.push(productElement);
            }
        }
        console.log(productList);
    } catch(error) {
        console.error(error);
        throw new Error(error);
    };
}



export async function getProduct(productId = undefined) {

    const url = new URL('https://panda-market-api-crud.vercel.app/products');

    if(productId === undefined) {
        console.log('상품 ID를 입력하세요');
        return;
    }

    if(isNaN(productId)) {
        console.log('상품 ID는 숫자를 입력해야합니다');
        return;
    }

    url.pathname += `/${productId}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
    } catch(error) {
        console.error(error);
        throw new Error(error);
    };
    
}

export async function createProduct(name, description, price, [tags], [images]) {

    const url = new URL('https://panda-market-api-crud.vercel.app/products');

    const createProductObject = {
        name,
        description,
        price,
        tags,
        images
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createProductObject),
        });
        const data = await res.json();
        console.log(data);
    } catch(error) {
        console.error(error);
        throw new Error(error);
    };
}

export async function patchProduct(name, description, price, [tags], [images], productId = undefined) {

    const url = new URL('https://panda-market-api-crud.vercel.app/products');

    if(productId === undefined) {
        console.log('상품 ID를 입력하세요');
        return;
    }

    if(isNaN(productId)) {
        console.log('상품 ID는 숫자를 입력해야합니다');
        return;
    }

    url.pathname += `/${productId}`;    

    const patchProductObject = {
        name,
        description,
        price,
        tags,
        images
    };

    try {
        const res = await fetch(url, {
            method: 'PATCH' ,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patchProductObject),
        })
        const data = await res.json();
        console.log(data);
    } catch(error) {
        console.error(error);
        throw new Error(error); 
    }

}

export async function deleteProduct(productId = undefined) {
    
    const url = new URL('https://panda-market-api-crud.vercel.app/products');

    if(productId === undefined) {
        console.log('상품 ID를 입력하세요');
        return;
    }

    if(isNaN(productId)) {
        console.log('상품 ID는 숫자를 입력해야합니다');
        return;
    }

    url.pathname += `/${productId}`;  

    try {
        const res = await fetch(url, {
            method: 'DELETE'
        })
        const data = await res.json();
        console.log(data);
    } catch(error) {
        console.error(error);
        throw new Error(error);
    }
}