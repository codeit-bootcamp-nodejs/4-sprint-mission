import { productRepository } from "./productRepository";
import { io } from "../socket/socket";

export const productService = {
    //<좋아요한 상품의 가격이 변동되었을 때 알림을 보내주세요.>
    async updatePrice(productId: number, newPrice: number) {
        //상품 가격 DB 업데이트
        const updatedProduct = await productRepository.updateProductPrice(productId, newPrice);

        //이 상품을 좋아요한 유저 찾기
        const likedUsers = await productRepository.findLikedUsers(productId);

        //알림 메시지 작성
        const message = `좋아요한 상품 "${updatedProduct.name}"의 가격이 ${newPrice.toLocaleString()}원으로 변경되었습니다.`;

        // 4️⃣ Socket.IO를 이용해 실시간 알림 전송
        likedUsers.forEach(({ userId }: { userId: number }) => {
            io.to(`user-${userId}`).emit("new-notification", { message });
        });

        // 5️⃣ 변경된 상품 정보 반환
        return updatedProduct;

    }
}