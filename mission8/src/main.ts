import httpServer from './app.js';
import { appConfig } from './config/app.config.js';
import logger from './utils/logger.js';

httpServer.listen(appConfig.port, () => {
  logger.info(`서버 이름: ${appConfig.app_name}`);
  logger.info(`서버 실행 포트: ${appConfig.port}`);
  logger.info(`환경: ${appConfig.node_env}`);
  logger.info(`CORS 허용: ${appConfig.cors_origin}`);
});
