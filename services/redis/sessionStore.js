/* eslint-disable no-await-in-loop */
const SESSION_TTL = 24 * 60 * 60;
const mapSession = ([userId, name, connected]) => (userId ? { userId, name, connected: connected === 'true' } : undefined);

class InMemorySessionStore {
  constructor(redisClient) {
    this.sessions = new Map();
    this.redisClient = redisClient;
  }

  findSession(id) {
    return this.redisClient
      .hmget(`session:${id}`, 'userId', 'name', 'connected')
      .then(mapSession);
  }

  findAll() {
    return this.redisClient.keys('*');
  }

  saveSession(id, { userId, name, connected }) {
    this.redisClient
      .multi()
      .hset(
        `session:${id}`,
        'userId',
        userId,
        'name',
        name,
        'connected',
        connected,
      )
      .expire(`session:${id}`, SESSION_TTL)
      .exec();
  }

  async findAllSessions() {
    const keys = new Set();
    let nextIndex = 0;
    do {
      const [nextIndexAsStr, results] = await this.redisClient.scan(
        nextIndex,
        'MATCH',
        'session:*',
        'COUNT',
        '100',
      );
      nextIndex = parseInt(nextIndexAsStr, 10);
      results.forEach((s) => keys.add(s));
    } while (nextIndex !== 0);
    const commands = [];
    keys.forEach((key) => {
      commands.push(['hmget', key, 'userId', 'name', 'connected']);
    });
    return this.redisClient
      .multi(commands)
      .exec()
      .then((results) => results
        .map(([err, session]) => (err ? undefined : mapSession(session)))
        .filter((v) => !!v));
  }
}

module.exports = InMemorySessionStore;
