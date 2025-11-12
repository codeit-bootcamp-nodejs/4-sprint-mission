import path from 'path';
import pino from 'pino';
import { fileURLToPath } from 'url';

import { appConfig } from '../config/app.config.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logPath = path.join(__dirname, '../../logs/app.log');

const logger = pino(
  {
    level: appConfig.logLevel, // appConfig에 맞춰서 level
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.transport({
    targets: [
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'yyyy-mm-dd HH:MM:ss',
        },
        level: 'debug',
      },
      {
        target: 'pino/file',
        options: { destination: logPath },
        level: 'info',
      },
    ],
  }),
);

export default logger;
