// .env 파일에 있는 환경변수들을 process.env에 불러옵니다.
require('dotenv').config();
// app.js 파일에서 Express 앱을 불러옵니다.
const app4 = require('./app');

// 환경변수 PORT가 있으면 사용하고, 없으면 기본값 3000을 사용합니다.
const PORT = process.env.PORT || 3000;
// 서버를 PORT 포트에서 실행하고, 준비가 되면 콜백 함수가 실행됩니다.
app4.listen(PORT, () => {

    // 서버가 실행 중임을 콘솔에 출력합니다.
    console.log(`Server listening on port ${PORT}`);
});