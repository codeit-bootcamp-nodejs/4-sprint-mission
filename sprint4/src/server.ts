// src/server.ts
import app from './app';

const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});