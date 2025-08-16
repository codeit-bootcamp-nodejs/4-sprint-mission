import express from 'express';
import prisma from '../client/prismaClient.js'


const router = express.Router();

///////////////////////////////////////////////////////////////댓글수정


router.patch('/:cid', async (req, res) => {
  const { cid } = req.params;
    const ccid = parseInt(cid);
    const { content } = req.body;
  const comment = await prisma.comment.update({
     where: { id: ccid },
     data: {content},
    });
  res.status(201).json(comment);
  });

////////////////////////////////////////////////////////////////댓글삭제

router.delete('/:cid', async (req, res) => {
  try{
  const { cid } = req.params;
    const ccid = parseInt(cid);
    await prisma.comment.delete({
     where: { id: ccid },
    });
   res.sendStatus(204);
   } 
   catch (error) {
    res.json({ message: "없는거 몰라?????;;;;" });
  }
});



////////////////////////////////////////////////////////////////

export default router;



  