// import express from "express";
// import { PrismaClient } from "@prisma/client";
// import { assert } from "superstruct";
// import asyncHandler from "../middlewares/asyncHandler.js";
// import { validateId } from "../middlewares/validateId.js";
// import { CreateArticle, PatchArticle, CreateComment } from "../validators/structs.js";

// const prisma = new PrismaClient();
// const articleRouter = express.Router();

// articleRouter
//     .route("/")
//     .get(
//         asyncHandler(async (req, res) => {
//             const { offset = 0, limit = 5, order = "asc", search = "", } = req.query;
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
//                         { title: { contains: search, mode: "insensitive" } },
//                         { content: { contains: search, mode: "insensitive"} },
//                     ],
//                   }
//                 : {};

//             const articles = await prisma.article.findMany({
//                 where: whereClause,
//                 orderBy,
//                 skip: parseInt(offset),
//                 take: parseInt(limit),
//                 select: {
//                     id: true,
//                     title: true,
//                     content: true,
//                     createdAt: true,
//                 },
//             });

//             res.json(articles);
//         })
//     )
//     .post(
//         asyncHandler(async (req, res) => {
//             assert(req.body, CreateArticle);
//             const article = await prisma.article.create({
//                 data: req.body,
//             });

//             res.status(201).json(article);
//         })
//     );

// articleRouter
//     .route("/:id")
//     .get(
//         validateId,
//         asyncHandler(async (req, res) => {
//             const { id } = req.params;
//             const parsedId = parseInt(id);
//             const article = await prisma.article.findUniqueOrThrow({
//                 where: { id: parsedId },
//                 select: {
//                     id: true,
//                     title: true,
//                     content: true,
//                     createdAt: true,
//                 },
//             });

//             res.json(article);
//         })
//     )
//     .patch(
//         validateId,
//         asyncHandler(async (req, res) => {
//             assert(req.body, PatchArticle);
//             const { id } = req.params;
//             const parsedId = parseInt(id);
//             const article = await prisma.article.update({
//                 where: { id: parsedId },
//                 data: req.body,
//             });

//             res.json(article);
//         })
//     )
//     .delete(
//         validateId,
//         asyncHandler(async (req, res) => {
//             const { id } = req.params;
//             const parsedId = parseInt(id);
//             await prisma.article.delete({
//                 where: { id: parsedId },
//             });

//             res.sendStatus(204);
//         })
//     );

// articleRouter
//     .route("/:id/comments")
//     .get(
//         validateId,
//         asyncHandler(async (req, res) => {
//             const { id } = req.params;
//             const articleId = parseInt(id);
//             const { cursor, limit = 5 } = req.query;

//             const queryOptions = {
//                 where: { articleId },
//                 orderBy: {
//                     createdAt: "desc",
//                 },
//                 select: {
//                     id: true,
//                     content: true,
//                     createdAt: true,
//                 },
//                 take: parseInt(limit),
//                 ...(cursor && { cursor: { id: parseInt(cursor) }, skip: 1 }),
//             };

//             const comments = await prisma.comment.findMany(queryOptions);

//             const nextCursor =
//                 comments.length === parseInt(limit)
//                     ? comments[comments.length - 1].id
//                     : null;

//             res.json({ comments, nextCursor });
//         })
//     )
//     .post(
//         validateId,
//         asyncHandler(async (req, res) => {
//             assert(req.body, CreateComment);
//             const { id } = req.params;
//             const articleId = parseInt(id);
//             const { content } = req.body;

//             await prisma.article.findUniqueOrThrow({
//                 where: { id: articleId },
//             });

//             const comment = await prisma.comment.create({
//                 data: {
//                     articleId,
//                     content,
//                 },
//             });

//             res.status(201).json(comment);
//         })
//     );

// export default articleRouter;
