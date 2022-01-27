// imports
const Queue = require("bull");

const connectQueue = (queueName) => {
  return new Queue(queueName, {
    redis: {
      port: parseInt(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB_INDEX
    },
  });
};

module.exports = { connectQueue };

