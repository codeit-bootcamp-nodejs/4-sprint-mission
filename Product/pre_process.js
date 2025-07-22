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
export async function getElecProductInstance(array){
    let elec_inst_array = [];
    for (let i of array){
        let new_elec = new ElectronicProduct(i);
        elec_inst_array.push(new_elec);
    }
    return elec_inst_array;
}

export async function getProductslist(){
    let input_data = await ProductService.getProductList(1,10,"");
        // console.log('input data(from HTTP): ',input_data);
    
        //데이터를 elec product와 그냥 product로 분류함
        let medium_data = await pre_process.getProductarray(input_data);
        // await console.log('product의 배열: ',medium_data[0], medium_data[0].length);
        // await console.log('elec_product의 배열', medium_data[1], medium_data[1].length);
        
        //product, elec product의 배열을 instacne로 변환함
        let product_inst = await pre_process.getProductInstance(medium_data[0]);
        let elec_inst = await pre_process.getElecProductInstance(medium_data[1]);
        // await console.log('product_inst = ', product_inst.);
        // await console.log('elect_inst : ', elec_inst);
        return [product_inst,elec_inst];
}