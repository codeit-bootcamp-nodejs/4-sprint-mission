import express from "express";
import { ProductController } from "./product.controller.js";
import { isProductOwner } from "../middle_ware/authorization.js";
import { isAuthenticated } from "../middle_ware/auth.middleWare.js";
import passport from "passport"
const router = express.Router();
const pc = new ProductController();

router.get("/", (req, res) => {console.log("상품 리스트 get 요청들어옴");pc.getProductListController(req, res)});

router.get("/:id", (req, res) => {console.log("GET PRODUCT/:id 요청들어옴");pc.getProductController(req, res)});

router.post("/", isAuthenticated,(req, res) => {console.log("Create PRODUCT 요청들어옴");pc.createProductController(req, res)});

router.delete("/:id",passport.authenticate("access-token", { session: false }), isAuthenticated,isProductOwner, (req, res) => {console.log("삭제 요청들어옴");pc.deleteProduct(req, res)});

router.patch("/:id",passport.authenticate("access-token", { session: false }), isAuthenticated,isProductOwner, (req, res) => {console.log("상품 수정 요청들어옴");pc.modifiedProduct(req, res)});

export default router;
