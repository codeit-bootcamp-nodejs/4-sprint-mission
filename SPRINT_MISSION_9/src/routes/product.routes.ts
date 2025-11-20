import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  return res.json([{ id: 1, name: "Product A" }]);
});

export default router;
