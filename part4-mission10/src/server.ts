import './env.js';
import http from 'http';

import { buildApp } from './app.js';
import { setupWebSocket } from './lib/ws.js';

async function startServer() {
  try {
    const app = await buildApp({ forTest: false });

    const server = http.createServer(app);
    setupWebSocket(server);

    const PORT = Number(process.env.PORT) || 3000;
    server.listen(PORT, '0.0.0.0', () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

startServer();
