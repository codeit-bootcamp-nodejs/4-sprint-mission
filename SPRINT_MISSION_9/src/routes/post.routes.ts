import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  return res.json([{ id: 10, title: "Hello Post" }]);
});

export default router;
