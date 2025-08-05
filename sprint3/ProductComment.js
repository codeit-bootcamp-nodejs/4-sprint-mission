import express from 'express';



const ProductCommentRouter= express.Router()

// ProductCommentRouter.get('', (req,res) => {
    
// });


// ProductCommentRouter.post('', (req,res) => {
//     const id = req.params.id ;
//     const product = prisma.product.findUnique({
//         where: {id}
//     });

//     if (!product){
//         res.status(404).send("no product");
//     }

    
//     const content = req.body.

//     const newComment = prisma.ProductComment.create({
//         data: {
//             //content
//         }
//     });
// });



// ProductCommentRouter.patch('', (req,res) => {
//     const id = req.params.id ;
//     const product = prisma.product.findUnique({
//         where: {id}
//     });

//     if (!product){
//         res.status(404).send("no product");
//     }

//     //comment 형식이 어떻게 req로부터 올지?
//     const CommentId = req.body.commentId;
//     //const content = req.body.

//     const newComment = prisma.ProductComment.update({
//         where:{
//             id:CommentId
//         },
//         data: {
//             //content
//         }
//     })
//     res.send(comment);
// });

// ProductCommentRouter.delete('', (req,res) => {
//     const id = req.params.id ;
    
//     const product = prisma.product.findUnique({
//         where: {id}
//     });
//     if (!product){
//         res.status(404).send("no product");
//     }

//     const newComment = prisma.Productcomment.delete({
//         where:{
//             id:CommentId
//         }
//     });
//     console.log("deleting comment completed");
//     res.send("deleting comment completed");
    
// });
