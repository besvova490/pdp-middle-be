const { Server } = require('socket.io');
const redisAdapter = require('socket.io-redis');

// services
const { redisClient } = require('./redis');

function startSocketServer(server) {
  return new Server(server, {
    cors: {
      origin: process.env.EXPRESS_FE_APP_URL,
    },
    adapter: redisAdapter({
      pubClient: redisClient,
      subClient: redisClient.duplicate(),
    }),
  });
}

module.exports = startSocketServer;
