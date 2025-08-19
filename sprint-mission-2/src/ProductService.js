class Product {
    name = '';
    description = '';
    price = 0;
    tags = [];
    images = [];
    favoriteCount = 0;

    constructor (name, description, price, tags, images) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.tags = tags;
        this.images = images;
    }

    favorite() {
        this.favoriteCount++;
    }
}

class ElectronicProduct extends Product {
    manufacturer = '';

    constructor(name, description, price, tags, images) {
        super(name, description, price, tags, images);
    }
}

const link = 'https://panda-market-api-crud.vercel.app/products';
const url = new URL(link);

let products = [];

export async function getProductList() {
    let address = url;

    address.searchParams.append('page', 1);
    address.searchParams.append('pageSize', 20);
    address.searchParams.append('keyword', '');

    let data, json;
    try {
        data = await fetch(address);
        json = await data.json();
    }
    catch(e) {
        console.error("에러 발생 : " + e);
    }
    for(let item of json.list) {
        if(!item.tags.includes('전자제품')) {
            products.push(new Product(
                item.name,
                item.description,
                item.price,
                item.tags,
                item.images,
            ));
        }
        else {
            products.push(new ElectronicProduct(
                item.name,
                item.description,
                item.price,
                item.tags,
                item.images,
            ));
        }
    }

    console.log(products);

    return json;
}

export async function getProduct() {
    let address = url;

    address.searchParams.append('productId', 1);

    try {
        let data = await fetch(address);
        let json = await data.json();

        console.log(json);

        return json;
    }
    catch(e) {
        console.error("에러 발생 : " + e);
    }
}

export async function createProduct() {
    try {
        let data = await fetch(url.toString(), {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        images: [
            "https://example.com/..."
        ],
        tags: [
            "전자제품"
        ],
        price: 0,
        description: "string",
        name: "상품 이름"
        }),
        });
        let json = await data.json();

        console.log(json);

        return json;
    }
    catch(e) {
        console.error("에러 발생 : " + e);
    }
}

export async function patchProduct() {
    let address = url;
    address.searchParams.append('productId', 1);
        try {
        let data = await fetch(url.toString(), {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        images: [
            "https://example.com/..."
        ],
        tags: [
            "전자제품"
        ],
        price: 0,
        description: "string",
        name: "상품 이름"
        }),
        });
        let json = await data.json();

        console.log(json);

        return json;
    }
    catch(e) {
        console.error("에러 발생 : " + e);
    }
}

export async function deleteProduct() {
    let address = url;
    address.searchParams.append('productId', 1);
        try {
        let data = await fetch(url.toString(), {
        method: "DELETE",
        });
        let json = await data.json();

        console.log(json);

        return json;
    }
    catch(e) {
        console.error("에러 발생 : " + e);
    }
}


