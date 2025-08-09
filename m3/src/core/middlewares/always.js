export default function (req, res, next) {
    // Render 로그에 이미 시간 정보가 있으므로, 여기서는 제외합니다.
    
    // 요청을 보낸 클라이언트의 IP 주소를 가져옵니다.
    // Render와 같은 클라우드 환경에서는 'x-forwarded-for' 헤더를 통해 실제 IP를 얻는 것이 더 정확합니다.
    const requestedIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // 요청의 HTTP 메서드 (GET, POST 등)
    const requestedMethod = req.method;

    // 요청된 전체 URL 경로 (쿼리 파라미터 포함)
    const requestedUrl = req.originalUrl;
    
    // 요청에 대한 간결한 로그를 남깁니다.
    // IP 주소, HTTP 메서드, URL 경로를 포함하여 누가, 어떤 경로로 요청했는지 쉽게 파악할 수 있습니다.
    console.log(`[Request Log] IP: ${requestedIp}, Method: ${requestedMethod}, URL: ${requestedUrl}`);

    // 다음 미들웨어로 제어를 넘깁니다.
    next();
}