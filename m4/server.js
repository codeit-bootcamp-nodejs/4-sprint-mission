import dotenv from 'dotenv';
import app from './src/app.js';
import { PORT } from './src/config/constants.js';

dotenv.config();

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});
