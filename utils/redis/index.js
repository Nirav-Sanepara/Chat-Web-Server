import { createClient } from "redis";

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("error", (error) => console.error("Redis client error", error));

export default redisClient;
