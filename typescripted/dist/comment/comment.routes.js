"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("../comment/comment.controller");
const comment_validation_1 = __importDefault(require("./comment.validation"));
const router = express_1.default.Router();
const commentController = new comment_controller_1.CommentController();
// 전체 댓글 조회 api
// 에러 코드 통합
// validtaion 분리
router.get("/", comment_validation_1.default.validateGetCommentList, async (req, res, next) => {
    const query = req.validatedQuery;
    const params = req.validatedParams;
    return await commentController.getComments(params, query, res, next);
});
// 해당 유저 인덱스 댓글 조회 API
// 특정 인덱스 찾아서 조회
//  에러 코드 통합
//  validtaion 분리
router.get("/:id", comment_validation_1.default.validateCommentById, async (req, res, next) => {
    const params = req.validatedParams;
    return await commentController.getCommentCont(params, res, next);
});
// 댓글 생성 API
// request body로 content, title을 가지고 오며, query로 type을 가지고 온다.
// type 에따라 데이터 연결한다..
//  에러 코드 통합
// todo: 로그인 한사람만 댓글을 생성할수있다
router.post("/", comment_validation_1.default.validateCreateComment, comment_validation_1.default.validateCommentById, async (req, res, next) => {
    const query = req.validatedQuery;
    const body = req.validatedBody;
    return await commentController.createCommentCont(body, query, res, next);
});
// 특정 댓글 수정 API
// 특정 인덱스를 받아서, request 바디 에 정보를 수정
//  에러 코드 통합
// validtaion 분리
// todo : 댓글을 쓴 사람만 댓글을 수정할 수 있다
// todo: debug
router.patch("/:id", comment_validation_1.default.validateCommentById, comment_validation_1.default.validateCreateComment, async (req, res, next) => {
    return await commentController.modifyCommentCont(req, res, next);
});
// 특정 댓글 삭제 API
// 특정 인덱스를 찾아서 삭제. 해당 데이터가 존재 하지 않으면 에러 던지기
// 에러 코드 통합
// todo: 댓글 작성자만 해당 댓글 삭제 가능
// todo: debug
// todo: validtaion 분리
router.delete("/:id", comment_validation_1.default.validateCommentById, async (req, res, next) => {
    return await commentController.deleteCommentCont(req, res, next);
});
exports.default = router;
