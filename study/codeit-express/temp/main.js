import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

// app.get('/hello', (req, res) => {
//     res.send('{"message":"Hi!"}');
// });

// app.get('/hello/:index', (req, res) => {
//     const index = req.params.index;

//     res.send(`{"message":"This is my hello #${index}"}`);
// });

app.get('/hello', (req, res) => {
    const {firstName, lastName} = req.query;

    res.send(`{"message":"Hi! My name is ${firstName} ${lastName}"}`);
});

app.post('/hello', (req, res) => {
    const { name, city } = req.body;

    res.send(`{"message":"Hi, I'm ${name}, from ${city}}`);
});

app.delete('/hello', (req, res) => {
    res.send(`{"message":"There's nothing to delete..."}`);
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});