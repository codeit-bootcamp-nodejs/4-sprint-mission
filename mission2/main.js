import {Product, ElectronicProduct} from "./Models/Model.js"
import { Article } from "./Models/Article.js"
import {getArticleList,getArticle,createArticle,patchArticle} from "./API/ArticleService.js"
import {getProductList,getProduct, createProduct, patchProduct} from "./API/ProductService.js"

async function run() {
  const list = await getProductList();

  // map으로 반환값 배열로 만듦
  const products = list.map(p => {
    const isElectronic = p.tags.includes("전자기기");

    // p.tags 찍고 싶으면 여기서 따로 찍기
    console.log(p.tags);

    return isElectronic
      ? new ElectronicProduct(
          p.name,
          p.price,
          p.tags,
          p.images,
          p.favoriteCount,
          p.manufacturer
        )
      : new Product(
          p.name,
          p.price,
          p.tags,
          p.images,
          p.favoriteCount,
          p.manufacturer
        );
  });

  console.log(products);
}

run();
