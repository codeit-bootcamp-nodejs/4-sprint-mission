import articleService from './services/ArticleService.js';
import productService from './services/ProductService.js';

class Product {
	constructor(name, description, price, tags, images, favoriteCount = 0) {
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
	constructor(name, description, price, tags, images, favoriteCount = 0, manufacturer) {
		super(name, description, price, tags, images, favoriteCount);
		this.manufacturer = manufacturer;
	}
}

class Article {
	constructor(title, content, writer, likeCount = 0) {
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

const { list: productList } = await productService.getProductList();

const products = productList.map(product => {
	const {
		name,
		description,
		price,
		tags,
		images,
		favoriteCount = 0,
		manufacturer
	} = product;

	if (tags.includes('전자제품')) {
		return new ElectronicProduct(name, description, price, tags, images, favoriteCount, manufacturer);
	}

	return new Product(name, description, price, tags, images, favoriteCount);
});

console.log(products);
