import { createProductService } from "../../services/product/create_product_service.js";

export async function createProductController(req, res) {
  try {
    const data = req.body;
    const result = await createProductService(data);
    res.send(result);
  } catch (e) {
    res.json({ message: e.message });
  }
}
