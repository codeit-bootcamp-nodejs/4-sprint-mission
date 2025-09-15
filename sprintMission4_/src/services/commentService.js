import prisma from '../lib/prisma.js';

async function registerProductComment(productId, authorId, content){
  try{
    const newComment = await prisma.comment.create({
      data: {
        content,
        authorId,
        productId
      }
    })
    return newComment;
  } catch(error){
    throw error;
  }
}

async function registerArticleComment(authorId, articleId, content){
  try{
    const newComment = await prisma.comment.create({
      data: {
        content,
        articleId,
        authorId,
      }
    })
    return newComment;
  } catch(error){
    throw error;
  }
}

async function updateComment(commmentId, content){
  try{
    const patchedComment = await prisma.comment.update({
      where: { id: commmentId},
      data: { content },
    })
    return patchedComment
  } catch(error){
    throw error;
  }
}

async function deleteComment(commentId){
  try{
    await prisma.comment.delete({ where: {commentId}});
  } catch(error){
    throw error;
  }
}


export default {
  registerProductComment,
  registerArticleComment,
  updateComment,
  deleteComment,

}