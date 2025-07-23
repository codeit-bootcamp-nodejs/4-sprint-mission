import * as Papi from "./ProductService.js";
import * as Aapi from "./ArticleService.js";

class Product {
  constructor({
    name = "상품 이름",
    description = "string",
    price = 0,
    tags = ["전자제품"],
    images = ["https://example.com/..."],
  }) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = 0;
  }
  favorite() {
    this.favoriteCount++;
  }
}

class ElectronicProduct extends Product {
  constructor({ name, description, price, tags, images }) {
    super({ name, description, price, tags, images });
    this.manufacturer = "제조업체";
  }
}

class Article {
  constructor(
    title = "게시글 제목입니다.",
    content = "게시글 내용입니다.",
    writer = "작성자입니다."
  ) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = 0;
    const date = new Date()
    const hour = date.getHours()
    const minute = date.getMinutes()
    this.createAt = `${hour}시 ${minute}분`
  }
  like() {
    this.likeCount++;
  }
}

const products = [];
const plist = await Papi.getProductList();
plist.list.forEach((item) => {
  if (item.tags.includes("전자제품")) {
    products.push(new ElectronicProduct(item));
  } else {
    products.push(new Product(item));
  }
});

const articles = [];
const alist = await Aapi.getArticleList();
alist.list.forEach((item) => {
  articles.push(new Article(item));
});

console.log(products)
console.log(articles)