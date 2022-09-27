// helpers
const { SOCKET_SESSION_STARTED } = require('./socketEvents');

module.exports = async ({ socket, messageStore, sessionStore }) => {
  const messagesPerUser = new Map();
  const userMessages = await messageStore.findMessagesForUser(socket.userId);

  userMessages.forEach((message) => {
    const { from, to } = message;
    const otherUser = socket.userId === from ? from : to;
    if (messagesPerUser.has(otherUser)) {
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message]);
    }
  });

  sessionStore.saveSession(socket.sessionId, {
    userId: socket.userId,
    name: socket.name,
    connected: true,
  });

  socket.emit(SOCKET_SESSION_STARTED, {
    sessionId: socket.sessionId,
    userId: socket.userId,
    name: socket.name,
    messages: messagesPerUser.get(socket.userId) || [],
  });

  socket.join(socket.userId);
};
