import { Request, Response } from "express";
import { productService } from "./productService";

    //<좋아요한 상품의 가격이 변동되었을 때 알림을 보내주세요.>
export async function updateProductPrice(req: Request, res: Response) {
    try {
        const productId = Number(req.params.id);
        const { newPrice } = req.body;
        const result = await productService.updatePrice(productId, newPrice);
        res.status(200).json({ message: "가격이 성곡적으로 변경되었습니다", result});
    } catch (error) {
        console.error("updateProductPrice Error",error);
        res.status(500).json({message: "가격 변경 실패"});
    }
}
