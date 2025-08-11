// badRequest 함수는 클라이언트 요청이 잘못되었을 때, 상태 코드 400과 함께 에러 메시지를 응답합니다.
function badRequest(res, message, details) {
    return res.status(400).json({ error: message, details });
}

// validateProductCreate 함수는 상품 생성 요청의 본문(req.body)에 필요한 필드들이 올바른지 검사합니다.
// 만약 필드가 없거나 조건에 맞지 않으면 400 에러를 반환합니다.
// 모든 검증을 통과하면 next()를 호출하여 다음 미들웨어나 라우트 핸들러로 진행합니다.
exports.validateProductCreate = (req, res, next) => {
    const { name, description, price } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) return badRequest(res, '상품명은 2자 이상 문자열이어야 합니다.');
    if (!description || typeof description !== 'string' || description.trim().length < 5) return badRequest(res, '설명은 5자 이상 문자열이어야 합니다.');
    if (price === undefined || isNaN(Number(price)) || Number(price) < 0) return badRequest(res, '가격은 0 이상의 숫자여야 합니다.');
    next();
};

// validateArticleCreate 함수는 게시글 생성 요청의 본문(req.body)에 필요한 제목과 내용이 올바른지 검사합니다.
// 조건에 맞지 않으면 400 에러를 반환하며, 통과 시 next()를 호출하여 다음 단계로 넘어갑니다.
exports.validateArticleCreate = (req, res, next) => {
    const { title, content } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length < 2) return badRequest(res, '제목은 2자 이상 문자열이어야 합니다.');
    if (!content || typeof content !== 'string' || content.trim().length < 5) return badRequest(res, '내용은 5자 이상 문자열이어야 합니다.');
    next();
};

// validateCommentCreate 함수는 댓글 생성 요청의 본문(req.body)에 댓글 내용이 있는지 검사합니다.
// 내용이 없거나 조건에 맞지 않으면 400 에러를 반환하고, 통과하면 next()를 호출합니다.
exports.validateCommentCreate = (req, res, next) => {
    const { content } = req.body;
    if (!content || typeof content !== 'string' || content.trim().length < 1) return badRequest(res, '댓글 내용이 필요합니다.');
    next();
};