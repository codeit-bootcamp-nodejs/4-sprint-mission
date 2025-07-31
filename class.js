import { getProductList } from './product.js';

class Product {
    constructor(name, description, price, tags, images, favoriteCount) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.tags = tags;
        this.images = images;
        this.favoriteCount = favoriteCount + 1;
    }
}

class Article {
    constructor(title, content, writer, likeCount = 0) {
        this.title = title;
        this.content = content;
        this.writer = writer;
        this.likeCount = likeCount + 1;
        this.createdAt = new Date();
    }
}

class ElectronicProduct extends Product{
    constructor(data) {
        super(
            data.name,
            data.description,
            data.price,
            data.hashTags,
            data.images,
            data.favoriteCount
        );
        this.manufacturer = manufacturer;
    }
}

async function main() {
    try {
        const productDataList = await getProductList();
        const products = [];

        for (const productData of productDataList) {
            if (productData.hashTags.includes('전자제품')) {
                products.push(new ElectronicProduct(productData));
            } else {
                products.push(new Product(productData));
            }
            }
            console.log(products);
        } catch (error) {
            console.error('❌ 상품 가져오기 실패:', error.message);
    }
}

main();
