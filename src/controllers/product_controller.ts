import { Request, Response } from "express";
import {
  createProductService,
  deleteProductService,
  getProductByIdService,
  getProductService,
  updateProductService,
} from "../services/product_service";

interface ProductParam {
  id: string;
}

interface ProductQuery {
  offset?: string;
  limit?: string;
  search?: string;
}

export async function createProductController(
  req: Request<{}, {}, Product.Create["data"]>,
  res: Response
) {
  try {
    const data = req.body;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const result = await createProductService({ data, user });
    res.send(result);
  } catch (e) {
    res.json({ message: (e as Error).message });
  }
}

export async function deleteProductController(
  req: Request<ProductParam>,
  res: Response
) {
  try {
    const id = parseInt(req.params.id);
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    await deleteProductService({ id, user });
    res.send("success");
  } catch (e) {
    if ((e as Error).message === "NOT_FOUND") {
      res.status(404).json({ message: "존재하지 않는 게시물입니다." });
    }
    if ((e as Error).message === "FORBIDDEN") {
      res.status(403).json({ message: "권한이 없습니다." });
    }
    res.json({ message: (e as Error).message });
  }
}

export async function getProductByIdController(
  req: Request<ProductParam>,
  res: Response
) {
  try {
    const id = parseInt(req.params.id);
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const result = await getProductByIdService({ id, user });
    res.send(result);
  } catch (e) {
    res.json({ message: (e as Error).message });
  }
}

export async function getProductController(
  req: Request<{}, {}, {}, ProductQuery>,
  res: Response
) {
  try {
    const offset = parseInt(req.query.offset ?? "0");
    const limit = parseInt(req.query.limit ?? "10");
    const search = req.query.search?.toString() || "";
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const result = await getProductService({ offset, limit, search, user });
    res.send(result);
  } catch (e) {
    res.json({ message: (e as Error).message });
  }
}

export async function updateProductController(
  req: Request<ProductParam, {}, Product.Create["data"]>,
  res: Response
) {
  try {
    const id = parseInt(req.params.id);
    const user = req.user;
    const { name, description, price, tags } = req.body;
    const updateData: Product.Update["updateData"] = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (tags) updateData.tags = tags;

    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const result = await updateProductService({ id, updateData, user });
    res.send(result);
  } catch (e) {
    if ((e as Error).message === "NOT_FOUND") {
      res.status(404).json({ message: "존재하지 않는 게시물입니다." });
    }
    if ((e as Error).message === "FORBIDDEN") {
      res.status(403).json({ message: "권한이 없습니다." });
    }
    res.json({ message: (e as Error).message });
  }
}
