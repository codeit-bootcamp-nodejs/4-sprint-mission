// import express from "express";
// import { PrismaClient } from "@prisma/client";
// import { assert } from "superstruct";
// import asyncHandler from "../middlewares/asyncHandler.js";
// import { validateId } from "../middlewares/validateId.js";
// import { CreateComment, CreateProduct, PatchProduct } from "../validators/structs.js";

// const prisma = new PrismaClient();
// const productRouter = express.Router();

// productRouter
//     .route("/")
//     .get(
//         asyncHandler(async (req, res) => {
//             const { offset = 0, limit = 5, order = "asc", search = "" } = req.query;
//             let orderBy;

//             switch (order) {
//                 case "recent":
//                     orderBy = { createdAt: "desc" };
//                     break;
//                 case "asc":
//                 default:
//                     orderBy = { createdAt: "asc" };
//                     break;
//             }

//             const whereClause = search
//                 ? {
//                     OR: [
//                         { name: { contains: search, mode: "insensitive" } },
//                         { description: { contains: search, mode: "insensitive"} },
//                     ],
//                   }
//                 : {};

//             const products = await prisma.product.findMany({
//                 where: whereClause,
//                 orderBy,
//                 skip: parseInt(offset),
//                 take: parseInt(limit),
//                 select: {
//                     id: true,
//                     name: true,
//                     price: true,
//                     createdAt: true,
//                 },
//             });

//             res.json(products);
//         })
//     )
//     .post(
//         asyncHandler(async (req, res) => {
//             assert(req.body, CreateProduct);
//             const product = await prisma.product.create({
//                 data: req.body,
//             });

//             res.status(201).json(product);
//         })
//     );

// productRouter
//     .route("/:id")
//     .get(
//         validateId,
//         asyncHandler(async (req, res) => {
//             const { id } = req.params;
//             const parsedId = parseInt(id);
//             const product = await prisma.product.findUniqueOrThrow({
//                 where: { id: parsedId },
//                 select: {
//                     id: true,
//                     name: true,
//                     description: true,
//                     price: true,
//                     tags: true,
//                     createdAt: true,
//                 },
//             });

//             res.json(product);
//         })
//     )
//     .patch(
//         validateId,
//         asyncHandler(async (req, res) => {
//             assert(req.body, PatchProduct);
//             const { id } = req.params;
//             const parsedId = parseInt(id);
//             const product = await prisma.product.update({
//                 where: { id: parsedId },
//                 data: req.body,
//             });

//             res.json(product);
//         })
//     )
//     .delete(
//         validateId,
//         asyncHandler(async (req, res) => {
//             const { id } = req.params;
//             const parsedId = parseInt(id);
//             await prisma.product.delete({
//                 where: { id: parsedId },
//             });

//             res.sendStatus(204);
//         })
//     );

// productRouter
//     .route("/:id/comments")
//     .get(
//         validateId,
//         asyncHandler(async (req, res) => {
//             const { id } = req.params;
//             const productId = parseInt(id);
//             const { cursor, limit = 5 } = req.query;

//             const queryOptions = {
//                 where: { productId },
//                 orderBy: { createdAt: "desc" },
//                 select: {
//                     id: true,
//                     content: true,
//                     createdAt: true,
//                 },
//                 take: parseInt(limit),
//                 ...(cursor && { cursor: { id: parseInt(cursor) }, skip: 1 }),
//             };
            
//             const comments = await prisma.comment.findMany(queryOptions);

//             // 다음 페이지를 위한 `nextCursor`를 생성
//             // 가져온 댓글이 `limit` 값보다 적으면 다음 댓글이 없는 것으로 간주
//             const nextCursor =
//                 comments.length === parseInt(limit)
//                     ? comments[comments.length - 1].id // 마지막 댓글의 ID를 다음 커서로 설정
//                     : null;

//             res.json({ comments, nextCursor });
//         })
//     )
//     .post(
//         validateId,
//         asyncHandler(async (req, res) => {
//             assert(req.body, CreateComment);
//             const { id } = req.params;
//             const productId = parseInt(id);
//             const { content } = req.body;

//             // 댓글 등록 전, productId에 해당하는 상품이 존재하는지 확인
//             await prisma.product.findUniqueOrThrow({
//                 where: { id: productId },
//             });

//             const comment = await prisma.comment.create({
//                 data: { 
//                     productId,
//                     content,
//                 },
//             });

//             res.status(201).json(comment);
//         })
//     );

// export default productRouter;
