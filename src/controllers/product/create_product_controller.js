import { createProductService } from "../../services/product/create_product_service.js";

export async function createProductController(req, res) {
  try {
    const data = req.body;
    const user = req.user;

    const result = await createProductService({ data, user });
    res.send(result);
  } catch (e) {
    res.json({ message: e.message });
  }
}
