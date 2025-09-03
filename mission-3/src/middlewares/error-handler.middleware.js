
export const errorHandler = (err, req, res, next) => {
    console.error(err);

    // Joi 유효성 검사 에러 처리 (나중에 Joi를 사용하게 될 경우를 위해 추가)
    if (err.isJoi) {
        return res.status(400).json({ message: err.details[0].message });
    }

    // Prisma 관련 에러 처리
    if (err.name.includes('Prisma')) {
        let statusCode = 500;
        let message = '서버 내부 오류가 발생했습니다.';

        switch (err.code) {
            case 'P2002': // 고유 제약 조건 실패
                statusCode = 409; // Conflict
                message = `${err.meta.target.join(', ')} 필드가 중복됩니다.`;
                break;
            case 'P2025': // 레코드를 찾을 수 없음
                statusCode = 404; // Not Found
                message = '요청한 리소스를 찾을 수 없습니다.';
                break;
            // 다른 Prisma 에러 코드에 대한 케이스 추가 가능
        }
        return res.status(statusCode).json({ message });
    }

    // 그 외 일반적인 에러 처리
    const statusCode = err.statusCode || 500;
    const message = err.message || '서버 내부 오류가 발생했습니다.';
    res.status(statusCode).json({ message });
};
