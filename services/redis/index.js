require('dotenv').config();
const Redis = require('ioredis');

// stores
const InMemoryMessageStore = require('./messageStore');
const InMemorySessionStore = require('./sessionStore');
const InMemoryVideoSession = require('./videoSessionStore');

const redisClient = new Redis({
  password: process.env.EXPRESS_APP_REDIS_PASSWORD,
  host: process.env.EXPRESS_APP_REDIS_HOST,
});

const sessionStore = new InMemorySessionStore(redisClient);
const messageStore = new InMemoryMessageStore(redisClient);
const videoSessionStore = new InMemoryVideoSession(redisClient);

module.exports = {
  redisClient,
  sessionStore,
  messageStore,
  videoSessionStore,
};
