import prisma from '@prisma/client';
const prisma =  new PrismaClient();



function main(){
    //product 10개, 댓글 각각 3개씩 생성
    for (i = 0; i < 10; i++){
        let name = `$product{i}`
        let description = `${i}`
        let price = `${i}000 won`
        let tags = `${i}st number`

        let productInstance = prisma.Product.create({
            data: {
                name,
                description,
                price,
                tags
            }
        });
        let productId = productInstance.id ;

        for (j = 0; j < 3; j++){
            let commentContent = `comment ${i}`
            prisma.ProductComment.create({
                data: {
                    commentContent,
                    productId
                }
            });
        }
    }

    //article
    for(x = 0; x < 10; x++){
        for (y = 0 ; y < 3; y++){
            let title = `title ${x+1}`;
            let articleContent = `text ${x+1} `

            let commentContent = `conmment ${y}`;

            let articleInstance = prisma.Article.create({
                data:{
                    title,
                    articleContent
                }
            });

            let articleId = articleInstance.id;
            
            prisma.articleComment.create({
                data:{
                    articleComment,
                    articleId
                }
            })
        }

    };
        

}
    
    
    



// title               String          
//   Articlecontent

main()
.then( () =>{
    console.log(`seeding 끝`)
}).catch( (e) =>{
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
})