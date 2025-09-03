
// 게시물 등록/수정 시 데이터의 유효성을 검증하는 미들웨어
export const validateArticleData = (req, res, next) => {
    const { title, content } = req.body;

    // POST 요청 시, 모든 필드가 필수 입력되어야 한다.
    if (req.method === "POST") {
        if (title === undefined || content === undefined) {
            return res.status(400).json({ message: "필수 입력값 누락 발생. (title, content)" });
        }
    }

    // 모든 필드의 데이터 타입 검증
    if (title !== undefined && typeof title !== "string") {
        return res.status(400).json({ message: "게시물 제목(title)은 문자열이어야 한다." });
    }
    if (content !== undefined && typeof content !== "string") {
        return res.status(400).json({ message: "게시물 내용(content)은 문자열이어야 한다." });
    }

    next();
};
