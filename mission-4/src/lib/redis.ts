import { createClient } from "redis";
import { REDIS_URL } from "./constants.js";

let redisClient;
let isReady = false;

async function connectToRedis() {
  if (isReady) {
    return;
  }

  redisClient = createClient({
    url: REDIS_URL,
  });

  redisClient.on("error", (err) => {
    console.error("Redis Client Error: ", err);
  });
  redisClient.on("ready", () => {
    isReady = true;
    console.log("Redis client is ready");
  });

  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
}

connectToRedis();

export { redisClient };
