// 상품 등록/수정 시 데이터의 유효성을 검증하는 미들웨어
export const validateProductData = ( req, res, next ) => {
    const { name, description, price } = req.body;
    //Post 요청시, 모든 필드가 필수 입력 돼야 한다
    if (req.method === "POST") {
        if(name === undefined || description === undefined || price === undefined){
            return res.status(400).json({ message: "필수 입력값 누락 발생. (name, description, price)"});
        }
    }
    // 모든 필드의 데이터 타입 검증
    if (name !== undefined && typeof name !== "string") {
        return res.status(400).json({ message: " 상품 이름(name)은 문자열이어야 한다."});
    }
    if (description !== undefined && typeof description !== "string") {
        return res.status(400).json({ message: "상품 설명(description)은 문자열이어야 한다."});
    }
    if (price !== undefined && typeof price !== "number") {
        return res.status(400).json({ message: "가격(price)은 숫자여야 한다."});
    }

    next();
};