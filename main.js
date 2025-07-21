
import * as ProductService from './Product/ProductService.js'
import * as pre_process from './Product/pre_process.js'
// let Product_list = product_HTTP.getProductList();

// product_HTTP.getProductList();


//get방식으로 데이터를 받아옴
async function main(){
    let input_data = await ProductService.getProductList(3,20,"");
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
    }

main();



