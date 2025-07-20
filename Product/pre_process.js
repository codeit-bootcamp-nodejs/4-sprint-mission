import { ElectronicProduct } from './ElectProductClass.js';
import { Product } from './ProductClass.js';



//서버에서 받아온 response를 전자제품인지 아닌지에 따라 다른 배열로 나눔
export async function getProductarray(response){
    let products = [];
    let elec_products = [];
    // console.log("count of response[list]", response["list"].length)
    for (let product of response["list"]){
        if (product.tags[0] == "전자제품" || product.tags[0] =='전자제품'){
            elec_products.push(product);
        }else{
            products.push(product);
        }
    }
    return [products, elec_products];
}

//배열 중 elec이 아닌 배열으로부터 입력을 받아 instace를 담은 배열을 만듬
export async function getProductInstance(array){
    let product_inst_array=[];
    for (let item of array){
        let new_inst = new Product(item);
        product_inst_array.push(new_inst);
    }
    return product_inst_array;

}

// 배열중 elec인 배열로부터 입력을 받아 elec instace의 배열을 만듦
export function getElecProductInstance(array){
    let elec_inst_array = [];
    for (let i of array){
        let new_elec = new ElectronicProduct(i);
        elec_inst_array.push(new_elec);
    }
    return elec_inst_array;
}