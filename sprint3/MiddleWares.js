import multer from "multer"

function ProductValid(req,res,next){
    const {name,description, price, tags} = req.body;
}


function ArticleValid(req,res,next){
    const {title, content} = req.body;
}



somefunction('', multer.single, (req,res) =>{

})