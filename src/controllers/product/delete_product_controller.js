import { deleteProductService } from "../../services/product/delete_product_service.js";

export async function deleteProductController(req, res) {
  try {
    const id = parseInt(req.params.id);
    deleteProductService(id);
    res.send("success");
  } catch (e) {
    res.json({ message: e.message });
  }
}
