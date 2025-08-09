import express from 'express';
import { assert } from 'superstruct';
import asyncHandler from '../core/middlewares/asyncHandler.js';
import { validateId } from '../core/middlewares/validateId.js';
import { PatchComment } from '../validators/structs.js';
import { commentService } from '../services/commentService.js';

const commentRouter = express.Router();

commentRouter
  .route('/:id')
  .get(
    validateId,
    asyncHandler(async (req, res) => {
      const comment = await commentService.getCommentById(req.params.id);
      res.json(comment);
    }),
  )
  .patch(
    validateId,
    asyncHandler(async (req, res) => {
      assert(req.body, PatchComment);
      const comment = await commentService.updateComment(req.params.id, req.body);
      res.json(comment);
    }),
  )
  .delete(
    validateId,
    asyncHandler(async (req, res) => {
      await commentService.deleteComment(req.params.id);
      res.sendStatus(204);
    }),
  );

export default commentRouter;
