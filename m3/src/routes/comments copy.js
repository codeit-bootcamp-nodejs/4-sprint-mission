// import express from "express";
// import { PrismaClient } from "@prisma/client";
// import { assert } from "superstruct";
// import asyncHandler from "../middlewares/asyncHandler.js";
// import { validateId } from "../middlewares/validateId.js";
// import { PatchComment } from "../validators/structs.js";

// const prisma = new PrismaClient();
// const commentRouter = express.Router();

// commentRouter
//     .route("/:id")
//     .get(
//         validateId,
//         asyncHandler(async (req, res) => {
//             const { id } = req.params;
//             const parsedId = parseInt(id);
//             const comment = await prisma.comment.findUniqueOrThrow({
//                 where: { id: parsedId },
//             });

//             res.json(comment);
//         })
//     )
//     .patch(
//         validateId,
//         asyncHandler(async (req, res) => {
//             assert(req.body, PatchComment);
//             const { id } = req.params;
//             const parsedId = parseInt(id);
//             const comment = await prisma.comment.update({
//                 where: { id: parsedId },
//                 data: req.body,
//             });

//             res.json(comment);
//         })
//     )
//     .delete(
//         validateId,
//         asyncHandler(async (req, res) => {
//             const { id } = req.params;
//             const parsedId = parseInt(id);
//             await prisma.comment.delete({
//                 where: { id: parsedId },
//             });

//             res.sendStatus(204);
//         })
//     );

// export default commentRouter;
