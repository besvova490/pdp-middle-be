// services
const { messageStore, sessionStore, videoSessionStore } = require('../services/redis');

// controllers
const auth = require('./auth');
const messages = require('./messages');
const sessionController = require('./sessionController');
const webRTC = require('./webRTC');

function onConnection(io, socket) {
  const args = {
    io,
    socket,
    sessionStore,
    messageStore,
    videoSessionStore,
  };

  auth(args);
  sessionController(args);
  messages(args);
  webRTC(args);
}

module.exports = onConnection;
