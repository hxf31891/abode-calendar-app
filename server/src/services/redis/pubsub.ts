import Redis from "ioredis";

const host = "localhost";
const port = 6379;
const db = 0;

const subscriber = new Redis({ host, port, db });
const publisher = new Redis({ host, port, db });

export default new (class PubSub {
  publish(channel: any, message: any) {
    publisher.publish(channel, message);
  }
  subscribe(channel: any) {
    subscriber.subscribe(channel);
  }
  on(event: any, callback: any) {
    subscriber.on(event, (channel: any, message: any) => {
      callback(channel, message);
    });
  }
})();
