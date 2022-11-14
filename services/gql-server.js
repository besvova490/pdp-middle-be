require('dotenv').config();

const { WebSocketServer } = require('ws');
const { ApolloServer } = require('apollo-server-express');
const { useServer } = require('graphql-ws/lib/use/ws');
const JWT = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

// schemas
const schema = require('../schemas');

// middleware
const setHttpPlugin = require('../middleware/setHttpPlugin');

const cors = {
  origin: [process.env.EXPRESS_FE_APP_URL, process.env.EXPRESS_SANDBOX_APP_URL],
};

async function startGQLServer(app, server) {
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/graphql',
  });
  const serverCleanup = useServer({
    schema,
    context: (req) => {
      const authToken = req.connectionParams.Authorization;
      const token = authToken && authToken.split(' ')[1];

      return JWT.verify(token, process.env.EXPRESS_APP_JWT_ACCESS_SECRET, (e, user) => {
        if (e) {
          throw new AuthenticationError(e);
        }

        return { req, user };
      });
    },
  }, wsServer);

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
    formatError: (err) => {
      // Don't give the specific errors to the client.
      if (err.message.startsWith('Database Error: ')) {
        return new Error('Internal server error');
      }

      // Otherwise return the original error. The error can also
      // be manipulated in other ways, as long as it's returned.
      return err;
    },
    plugins: [{
      ...setHttpPlugin,
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    }],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors });
}

module.exports = startGQLServer;
