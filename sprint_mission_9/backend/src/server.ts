import http from 'http';
import { app, prisma } from './app';
import { env } from './shared/config/env';

const server = http.createServer(app);

// Graceful shutdown
async function gracefulShutdown(signal: string) {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  // Close server
  server.close(() => {
    console.log('HTTP server closed');
  });

  // Disconnect Prisma
  await prisma.$disconnect();
  console.log('Prisma disconnected');

  process.exit(0);
}

// Register shutdown handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

const PORT = env.PORT;

server.listen(PORT, () => {
  if (env.NODE_ENV === 'development') {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api`);
  }
});
