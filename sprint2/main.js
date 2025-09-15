
import * as ProductService from './Product/ProductService.js'
import * as pre_process from './Product/pre_process.js'
// let Product_list = product_HTTP.getProductList();

// product_HTTP.getProductList();


//get방식으로 데이터를 받아옴
async function main(){
    pre_process.getProductslist();
}
main();



