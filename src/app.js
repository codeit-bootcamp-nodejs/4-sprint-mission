// express 모듈을 불러와서 웹 서버를 쉽게 만들기 위해 사용
const express3 = require('express');
// 파일 경로를 다루기 위한 path 모듈
const path3 = require('path');
// 요청 로그를 기록하기 위한 morgan 모듈
const morgan3 = require('morgan');
// 보안 관련 HTTP 헤더를 설정해주는 helmet 모듈
const helmet3 = require('helmet');
const marketRoutes = require('./routes/market'); // 시장 관련 API 라우트 모듈
const boardRoutes = require('./routes/board'); // 게시판 관련 API 라우트 모듈
const uploadRoutes = require('./routes/upload'); // 파일 업로드 관련 API 라우트 모듈
const errorHandler3 = require('./middlewares/errorHandler'); // 에러 처리를 위한 미들웨어

const app = express3(); // express 앱 생성

app.use(helmet3()); // 보안을 위해 다양한 HTTP 헤더를 설정하는 helmet 미들웨어 사용
app.use(morgan3('dev')); // 개발 모드에서 요청 로그를 콘솔에 출력하는 morgan 미들웨어 사용
app.use(express3.json()); // 요청 본문이 JSON일 경우 자동으로 파싱해주는 미들웨어 사용
app.use('/uploads', express3.static(path3.join(__dirname, 'uploads'))); // uploads 폴더를 정적 파일 제공 경로로 설정하여 업로드된 파일 접근 가능하게 함

// 라우트 모듈 분리: 각 기능별로 라우트를 분리하여 관리
// '/api/market' 경로로 들어오는 요청은 marketRoutes에서 처리
app.use('/api/market', marketRoutes);
// '/api/board' 경로로 들어오는 요청은 boardRoutes에서 처리
app.use('/api/board', boardRoutes);
// '/api/upload' 경로로 들어오는 요청은 uploadRoutes에서 처리
app.use('/api/upload', uploadRoutes);

// 404 처리: 위에서 처리하지 못한 모든 요청에 대해 경로를 찾을 수 없다는 응답을 보냄
app.use((req, res, next) => {
    res.status(404).json({ error: '요청하신 경로를 찾을 수 없습니다.' });
});

// 에러 핸들러 (최후): 모든 미들웨어 이후에 발생한 에러를 처리하는 미들웨어
app.use(errorHandler3);

module.exports = app; // 생성한 앱을 다른 파일에서 사용할 수 있도록 내보냄
