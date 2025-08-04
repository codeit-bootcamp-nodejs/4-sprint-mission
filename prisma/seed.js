import { PrismaClient } from '@prisma/client';

const prisma =  new PrismaClient();



async function main(){
    //product 10개, 댓글 각각 3개씩 생성
    for (let i = 0; i < 10; i++){
        let name = `product${i}`;
        let description = `${i}`;
        let price = 1000;
        let tags = `${i}st number`;

        let productInstance = await prisma.Product.create({
            data: {
                name,
                description,
                price,
                tags
            }
        });
        let productId = productInstance.id ;

        for (let j = 0; j < 3; j++){
            let commentContent = `comment ${i}`
            await prisma.ProductComment.create({
                data: {
                    commentContent,
                    productId
                }
            });
        }
        console.log(productInstance);
    }

    //article 10개, 댓글 각각 3개씩 생성
    for(let x = 0; x < 10; x++){
        for (let y = 0 ; y < 3; y++){
            let title = `title ${x+1}`;
            let articleContent = `text ${x+1} `

            let commentContent = `conmment ${y}`;

            let articleInstance = await prisma.Article.create({
                data:{
                    title,
                    articleContent
                }
            });

            let articleId = articleInstance.id;
            
            await prisma.articleComment.create({
                data:{
                    commentContent,
                    articleId
                }
            })
            
        }
    };
}
    
    

main()
.then( () =>{
    console.log(`seeding 끝`)
}).catch( (e) =>{
    console.error(e);
}).finally(async () => {
    await prisma.$disconnect();
})