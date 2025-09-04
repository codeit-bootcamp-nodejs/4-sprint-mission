import { getProductService } from "../../services/product/get_product_service.js";

export async function getProductController(req, res) {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search?.toString() || "";

    const result = await getProductService(offset, limit, search);
    res.send(result);
  } catch (e) {
    res.json({ message: e.message });
  }
}
