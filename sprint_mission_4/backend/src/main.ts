// main.ts
import 'dotenv/config';
import app from './app.js';

const port: number = parseInt(process.env['PORT'] || '3000', 10);

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
