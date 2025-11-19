import { createClient, type RedisClientType } from 'redis';
import { REDIS_URL } from '@/lib/constants.js';
import { InternalServerError } from '@/lib/errors.js';

let redisClient: RedisClientType;
let isReady = false;

export async function connectToRedis() {
  if (isReady) {
    return;
  }
  if (!REDIS_URL) {
    throw new InternalServerError('REDIS_URL 환경변수가 설정되지 않았습니다.');
  }

  redisClient = createClient({
    url: REDIS_URL,
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error: ', err);
  });
  redisClient.on('ready', () => {
    isReady = true;
    console.log('Redis client is ready');
  });

  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
}

export { redisClient };
