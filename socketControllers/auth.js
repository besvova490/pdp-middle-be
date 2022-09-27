module.exports = ({
  io,
  sessionStore,
}) => {
  io.use(async (socket, next) => {
    const { sessionId } = socket.handshake.auth;
    if (sessionId) {
      const session = await sessionStore.findSession(sessionId);
      if (session) {
        socket.sessionId = sessionId;
        socket.userId = +session.userId;
        socket.name = session.name;
        return next();
      }
    }

    const { name } = socket.handshake.auth;
    const { userId } = socket.handshake.auth;

    if (!name || !userId) return next(new Error('invalid username'));

    socket.sessionId = +userId;
    socket.userId = +userId;
    socket.name = name;

    next();
  });
};
