import express from 'express';

const app = express();
const port = 3000;

// 힌트 1: 요청 본문(req.body)을 JSON 파싱하기 위한 코드 추가
app.use(express.json());

// 임시 할 일 목록 데이터.
// 이 배열을 기반으로 CRUD를 하세요.
let todos = [
  { id: 1, title: 'Express 라우팅 연습', completed: false },
  { id: 2, title: 'ESLint & Prettier 설정하기', completed: false }
];
let nextId = 3; // 새로 추가되는 다음 할 일에 부여할 ID

// --- 1. GET 요청: 모든 할 일 목록 조회 ---
// Endpoint: GET /todos
app.get('/todos', (req, res) => {
    res.send(todos);
});

// --- 2. POST 요청: 새로운 할 일 추가 ---
// Endpoint: POST /todos
// 요청 본문 예시: { "title": "새로운 기능 구현" }
app.post('/todos', (req, res) => {
    const data = req.body;

    todos.push(data);
    res.send("추가 성공");
});

// --- 3. PUT 요청: 특정 할 일 전체 수정 ---
// Endpoint: PUT /todos/:id
// URL 파라미터 :id로 대상 할 일을 식별.
// 요청 본문 예시: { "title": "수정된 할 일 내용", "completed": true }
app.put('/todos/:id', (req, res) => {
    const data = req.body;
    const index = todos.findIndex(x => x.id == req.params.id);

    todos[index] = data;
    res.send("수정 성공");
});

// --- 4. PATCH 요청: 특정 할 일 부분 수정 ---
// Endpoint: PATCH /todos/:id
// URL 파라미터 :id로 대상 할 일을 식별.
// 요청 본문 예시: { "completed": true } 또는 { "title": "부분 수정된 내용" }
app.patch('/todos/:id', (req, res) => {
    const data = req.body;
    const index = todos.findIndex(x => x.id == req.params.id);

    Object.assign(todos[index], data);
    res.send("수정 성공");
});

// --- 5. DELETE 요청: 특정 할 일 삭제 ---
// Endpoint: DELETE /todos/:id
// URL 파라미터 :id로 대상 할 일을 식별.
app.delete('/todos/:id', (req, res) => {
    const index = todos.findIndex(x => x.id == req.params.id);

    todos.splice(index, 1)
    res.send("삭제 성공");
});


app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});