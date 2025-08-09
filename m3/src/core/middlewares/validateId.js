export const validateId = (req, res, next) => {
    const { id } = req.params;

    // 양의 정수만 허용하는 정규식 (1, 2, 3, ..., 123, 999 등)
    const integerRegex = /^[1-9]\d*$/;

    if (!integerRegex.test(id)) {
        return res.status(400).json({
            success: false,
            message: "ID는 양의 정수여야 합니다.",
            received: id,
        });
    }

    const parsedId = parseInt(id, 10);
    req.params.id = parsedId;
    next();
};
