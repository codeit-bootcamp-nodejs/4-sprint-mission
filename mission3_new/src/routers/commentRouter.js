import express from 'express';
import prisma from '../client/prismaClient.js'
import { assert } from 'superstruct';
import { PatchComment } from '../validators/structor.js';
import asyncHandler from '../middlewares/asyncHandler.js';


const router = express.Router();

///////////////////////////////////////////////////////////////댓글수정


router.patch('/:cid', asyncHandler(async (req, res) => {
  assert(req.body, PatchComment);
  const { cid } = req.params;
    const ccid = parseInt(cid);
    const { content } = req.body;
  const comment = await prisma.comment.update({
     where: { id: ccid },
     data: {content},
    });
  res.status(201).json(comment);
}));

////////////////////////////////////////////////////////////////댓글삭제

router.delete('/:cid', asyncHandler(async (req, res) => {
  const { cid } = req.params;
    const ccid = parseInt(cid);
    await prisma.comment.delete({
     where: { id: ccid },
    });
   res.sendStatus(204);
}));



////////////////////////////////////////////////////////////////

export default router;



  