import { updateProductService } from "../../services/product/update_product_service.js";

export async function updateProductController(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = req.user;
    const { name, description, price, tags } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (tags) updateData.tags = tags;

    const result = await updateProductService({ id, updateData, user });
    res.send(result);
  } catch (e) {
    if (e.message === "NOT_FOUND") {
      res.status(404).json({ message: "존재하지 않는 게시물입니다." });
    }
    if (e.message === "FORBIDDEN") {
      res.status(403).json({ message: "권한이 없습니다." });
    }
    res.json({ message: e.message });
  }
}
