import Redis from "ioredis";

const host = "localhost";
const port = 6379;
const db = 0;

export default class RedisRepo {
  redis: any;

  constructor() {
    this.redis = new Redis({ port, host, db });
    this.redis.on("ready", () => {
      this.redis.config("SET", "notify-keyspace-events", "Ex");
    });
  }
  get(key: string): string {
    return this.redis.get(key);
  }
  setReminder(key: any, expire: any): void {
    const expireInSeconds = Math.floor((expire.getTime() - Date.now()) / 1000);
    this.redis.multi().set(`reminder:${key}`, 1).expire(`reminder:${key}`, expireInSeconds).exec();
  }
}
