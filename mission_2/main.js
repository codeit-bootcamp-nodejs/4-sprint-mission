import articleService from './services/ArticleService.js';
import productService from './services/ProductService.js';

class Product {
	name;
	description;
	price;
	tags;
	images;
	favoriteCount;

	constructor(name, description, price, tags, images, favoriteCount=0) {
		this.name = name;
		this.description = description;
		this.price = price;
		this.tags = tags;
		this.images = images;
		this.favoriteCount = favoriteCount;
	}

	favorite() {
		this.favoriteCount++;
	}
}

class ElectronicProduct extends Product {
	manufacturer;

	constructor(name, description, price, tags, images, favoriteCount=0, manufacturer) {
		super(name, description, price, tags, images, favoriteCount=0);
		this.manufacturer = manufacturer;
	}
}

class Article {
	title;
	content;
	writer;
	likeCount;
	createdAt;

	constructor(title, content, writer, likeCount=0) {
		this.title = title;
		this.content = content;
		this.writer = writer;
		this.likeCount = likeCount;
		this.createdAt = new Date().toISOString();
	}

	like() {
		this.likeCount++;
	}
}

let products = [];


let res = 0;

// Test code for getProductList method
const productList = await productService.getProductList();
for (const product of productList.list) {
	// console.log(product);
	if (product.tags.includes('전자제품')) {
		// console.log('전자제품 태그 포함됨');
		products.push(new ElectronicProduct(
			product.name,
			product.description,
			product.price,
			product.tags,
			product.images,
			product.favoriteCount,
			product.manufacturer
		));
	} else {
		products.push(new Product(
			product.name,
			product.description,
			product.price,
			product.tags,
			product.images,
		));
	}
}
// console.log(products);


// Test code for getProduct method
// res = await productService.getProduct(9);
// console.log(res);


// Test code for createProduct method
/* res = await productService.createProduct(
	'dragon', 
	'myDragonDesc', 
	9999, 
	['dragon', ], 
	['https://myImages', ],
)
console.log(res); */


// Test code for patchProduct method
/* res = await productService.patchProduct({
	productId: 1195,
	name: 'modifiedDragon',
	description: 'modifiedDesc',
	price: 1111,
	tags: ['kirakira', ],
});
console.log(res); */


// Test code for deleteProduct method
/* res = await productService.deleteProduct(1195);
console.log(res); */