import redisClient from "../../../utils/redis/index.js";

export class CacheServices {
  constructor() {
    this.client = redisClient;
  }

  async getCache(key) {
    return this.client.get(key);
  }

  async setCache(key, value, expiry = 3600) {
    await this.client.set(key, JSON.stringify(value), "EX", expiry);
  }
}
