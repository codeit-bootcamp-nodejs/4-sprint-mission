import axios from 'axios';
import * as Productfile from './ProductService.js'
import * as Articlefile from './ArticleService.js' 


function checkData() {
    const products = [];
    const responseData = Productfile.getProductlist();
    const objs= responseData.list;
    objs.forEach((data)=>{
        if(data.tags.includes('전자제품')){
            const isElectronicProduct = new EletronicProduct(id, name, description, price, manufacturer, tag, images, createdAt, updatedAt);
            products.push(isElectronicProduct);
        } else{
            const isNotElectioncProduct = new Product (id, name, description, price, tag, images, createdAt, updatedAt);
            products.push(isNotElectioncProduct)
        }
    }
)}



