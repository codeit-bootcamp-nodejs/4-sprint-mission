import { getProductByIdService } from "../../services/product/get_product_by_id_service.js";

export async function getProductByIdController(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = req.user;
    const result = await getProductByIdService(id, user);
    res.send(result);
  } catch (e) {
    res.json({ message: e.message });
  }
}
