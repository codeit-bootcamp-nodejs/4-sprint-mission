import 'reflect-metadata';
import app from './app.js';
const { PORT } = process.env;

const port = PORT || 3000;

app.get('/', (_req, res) => {
  res.send('API is up and running');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
