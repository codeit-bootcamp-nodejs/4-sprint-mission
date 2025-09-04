import { updateProductService } from "../../services/product/update_product_service.js";

export async function updateProductController(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { name, description, price, tags } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (tags) updateData.tags = tags;

    const result = await updateProductService({ id, updateData });
    res.send(result);
  } catch (e) {
    res.json({ message: e.message });
  }
}
