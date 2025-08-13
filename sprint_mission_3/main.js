// main.js
import app from './src/app.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
