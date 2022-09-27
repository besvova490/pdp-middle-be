// helpers
const { SOCKET_PRIVATE_MESSAGE } = require('./socketEvents');

module.exports = ({
  io,
  socket,
  messageStore,
}) => {
  socket.on(SOCKET_PRIVATE_MESSAGE, (data) => {
    messageStore.saveMessage(data.chatId, data);
    io.to([data.receiver.id, socket.userId]).emit(SOCKET_PRIVATE_MESSAGE, data);
  });
};
