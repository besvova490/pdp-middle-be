// helpers
const { PRE_OFFER, JOIN_TO_THE_CALL } = require('./socketEvents');

module.exports = ({
  socket,
  videoSessionStore,
}) => {
  socket.on(PRE_OFFER, (data) => {
    videoSessionStore.createSession({ id: data.code, author: data.author });
  });

  socket.on(JOIN_TO_THE_CALL, async (data) => {
    socket.join(data.code);

    const { code, guest, ...rest } = data;
    const videoSession = await videoSessionStore.findSession(code);

    if (!videoSession) return;
    videoSessionStore.connectSession({ id: code, guest });
    const guestsToSet = (videoSession.guests || []).filter((item) => item.id !== guest.id);

    socket.to(data.code).emit(
      JOIN_TO_THE_CALL,
      { guest: [...guestsToSet, guest], ...rest },
    );
  });
};
