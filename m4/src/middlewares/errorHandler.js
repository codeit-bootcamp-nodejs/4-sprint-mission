class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || '서버 오류가 발생했습니다.';

    // 콘솔에 에러 로그 출력 (개발용)
    console.error(err);

    res.status(status).json({
        message: message,
    });
};

export default errorHandler;
export { CustomError };
