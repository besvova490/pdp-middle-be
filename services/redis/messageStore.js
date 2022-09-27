const CONVERSATION_TTL = 24 * 60 * 60;

class InMemoryMessageStore {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }

  saveMessage(chatId, message) {
    const massageToString = JSON.stringify(message);

    this.redisClient
      .multi()
      .rpush(`messages:${chatId}`, massageToString)
      .expire(`messages:${chatId}`, CONVERSATION_TTL)
      .exec();
  }

  findMessagesForUser(chatId) {
    return this.redisClient
      .lrange(`messages:${chatId}`, 0, -1)
      .then((results) => results.map((result) => JSON.parse(result)));
  }
}

module.exports = InMemoryMessageStore;
