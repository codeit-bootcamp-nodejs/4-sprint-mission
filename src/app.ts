import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 라우트
app.use('/api', routes);

// 헬스 체크 엔드포인트
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    
    message: '서버가 정상적으로 작동 중입니다.',
    timestamp: new Date().toISOString() 
  });
});

// 에러 핸들러
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('서버 에러:', err.stack);
  res.status(500).json({ 
    error: '서버에서 오류가 발생했습니다.',
    message: err.message 
  });
});

// 404 핸들러
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: '요청하신 리소스를 찾을 수 없습니다.',
    path: req.path 
  });
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

export default app;