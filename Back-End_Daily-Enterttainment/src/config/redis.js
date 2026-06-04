const { createClient } = require('redis');

console.log("Checking Redis Password:", process.env.REDIS_PASSWORD ? "Loaded (Length: " + process.env.REDIS_PASSWORD.length + ")" : "UNDEFINED!");

const redisClient = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

// Koneksikan client
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();

module.exports = redisClient;
