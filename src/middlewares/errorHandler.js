/**
* 이 파일은 Express에서 사용하는 에러 처리 미들웨어입니다.
* 모든 라우트에서 발생한 에러가 이 함수로 전달됩니다.
* module.exports = (err, req, res, next) => {...} 는
* 이 함수를 모듈로 내보내서 다른 곳에서 사용할 수 있게 해줍니다.
* (err, req, res, next)는 Express에서 에러 처리 미들웨어임을 나타냅니다.
*/
module.exports = (err, req, res, next) => {
    // 에러 발생 시, 서버 콘솔에 에러 내용을 출력합니다.
    // 개발 중에는 에러 원인을 쉽게 찾기 위해 사용합니다.
    console.error(err);

    // Prisma에서 리소스를 찾지 못했을 때 발생하는 에러 코드(P2025)를 처리합니다.
    // 예를 들어, 삭제하려는 데이터가 없을 때 이 에러가 발생할 수 있습니다.
    if (err.code === 'P2025') {
        // 404 Not Found 상태 코드와 함께 에러 메시지를 클라이언트에게 보냅니다.
        return res.status(404).json({ error: '리소스를 찾을 수 없습니다.' });
    }

    /** 
     * 커스텀 HTTP 에러 처리입니다.
     * err.status가 400 이상 600 미만이면,
     * (예: 400 Bad Request, 401 Unauthorized, 404 Not Found 등)
     * 해당 상태 코드와 에러 메시지를 클라이언트에게 보냅니다.
    */
    if (err.status && err.status >= 400 && err.status < 600) {
        return res.status(err.status).json({ error: err.message || '에러가 발생했습니다.' });
    }

    // 위 조건에 해당하지 않는 모든 에러는 서버 내부 에러(500)로 처리합니다.
    // 예상하지 못한 에러가 발생했을 때 기본적으로 사용됩니다.
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
};