const SESSION_TTL = 24 * 60 * 60;

const mapSession = ([author, guests], id) => {
  if (id) {
    return {
      code: id,
      author: JSON.parse(author),
      guests: JSON.parse(guests) || [],
    };
  }

  return undefined;
};

class InMemoryVideoSession {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }

  createSession({ id, author }) {
    this.redisClient
      .multi()
      .hset(
        `session:${id}`,
        'author',
        JSON.stringify(author),
      )
      .expire(`session:${id}`, SESSION_TTL)
      .exec();
  }

  findSession(id) {
    return this.redisClient
      .hmget(`session:${id}`, 'author', 'guests')
      .then((e) => mapSession(e, id));
  }

  async connectSession({ id, guest }) {
    const session = await this.redisClient
      .hmget(`session:${id}`, 'author', 'guests')
      .then((e) => mapSession(e, id));

    if (!session) return;

    const guests = (session.guests || []).filter((item) => item.id !== guest.id);
    const guestsToSet = [...guests, guest];

    await this.redisClient
      .multi()
      .hset(
        `session:${id}`,
        'author',
        JSON.stringify(session.author),
        'guests',
        JSON.stringify(guestsToSet),
      )
      .expire(`session:${id}`, SESSION_TTL)
      .exec();
  }
}

module.exports = InMemoryVideoSession;
