import rateLimit from 'express-rate-limit';

import { appConfig } from '../config/app.config.js';
import { MESSAGE, STATUS_CODE } from '../constants/constant.js';

export const limiter = rateLimit({
  windowMs: appConfig.rateLimitWindowMs,
  max: appConfig.rateLimitMax,
  message: {
    statusCode: STATUS_CODE.TOO_MANY_REQUESTS,
    message: MESSAGE.tooManyRequests,
  },
});
