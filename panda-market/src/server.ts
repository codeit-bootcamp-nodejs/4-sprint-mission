import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import { socketServer } from '@/lib/socket.js';
import { app } from '@/app.js';
import { connectToRedis } from '@/lib/redis.js';
import { PORT as port } from '@/lib/constants.js';
import { PUBLIC_URL } from '@/lib/constants.js';

const httpServer = http.createServer(app);

socketServer(httpServer);

const PORT = port || 3000;
const BASE_URL = PUBLIC_URL || `http://localhost:${PORT}`;
async function startServer() {
  await connectToRedis();

  httpServer.listen(PORT, () => {
    console.log(`
  ################################################
  🛡️  Server listening on port: ${PORT} (Internal)
  ################################################
  
  🚀  Server:    ${BASE_URL}
  🩺  Health:    ${BASE_URL}/health
  📚  Swagger:   ${BASE_URL}/docs
  
  ################################################
    `);
  });
}
startServer();
