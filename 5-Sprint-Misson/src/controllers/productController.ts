import { Request, Response } from "express";
import { ProductService } from "../services/productService";
import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";
import { validate } from "class-validator";

const productService = new ProductService();

export const createProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "로그인 필요" });

    const dto = Object.assign(new CreateProductDto(), req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors });
    }

    const product = await productService.createProduct(req.user.id, dto);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "상품 등록 오류" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const product = await productService.getProductById(id, req.user?.id);
    if (!product) return res.status(404).json({ error: "상품 없음" });
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "상품 조회 실패" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "로그인 필요" });

    const id = Number(req.params.id);
    const dto = Object.assign(new UpdateProductDto(), req.body);

    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors });
    }

    const updated = await productService.updateProduct(id, req.user.id, dto);
    if (!updated) return res.status(404).json({ error: "상품 없음" });

    res.status(200).json(updated);
  } catch (err: any) {
    console.error(err);
    if (err.message === "FORBIDDEN") {
      return res.status(403).json({ error: "권한 없음" });
    }
    res.status(500).json({ error: "수정 중 오류" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "로그인 필요" });

    const id = Number(req.params.id);
    const deleted = await productService.deleteProduct(id, req.user.id);
    if (!deleted) return res.status(404).json({ error: "상품 없음" });

    res.status(204).send();
  } catch (err: any) {
    console.error(err);
    if (err.message === "FORBIDDEN") {
      return res.status(403).json({ error: "권한 없음" });
    }
    res.status(500).json({ error: "삭제 중 오류" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = "1", pageSize = "10", sort = "recent", search = "" } = req.query;
    const result = await productService.getProducts(
      Number(page),
      Number(pageSize),
      sort === "recent" ? "recent" : "asc",
      String(search)
    );
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "조회 오류" });
  }
};
