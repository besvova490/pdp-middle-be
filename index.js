require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http');
const methodOverride = require('method-override');

// routes
const router = require('./routes');

// service
const startGQLServer = require('./services/gql-server');
const { connectionCheck } = require('./services/postgres');
const startSocketServer = require('./services/socket');

// controllers
const onConnection = require('./socketControllers');

// cors settings
app.use(cors({
  origin: process.env.EXPRESS_APP_FE_HOST,
  credentials: true,
}));

// app base settings
app.use(express.json());
app.use(methodOverride());
app.use('/api', router);

// server init...
const server = http.createServer(app);

connectionCheck().then(() => {
  startGQLServer(app);
  const io = startSocketServer(server);
  io.on('connection', (socket) => onConnection(io, socket));

  server.listen(process.env.EXPRESS_APP_PORT, () => {
    console.log(`listening on *:
  http://localhost:${process.env.EXPRESS_APP_PORT}/api
  http://localhost:${process.env.EXPRESS_APP_PORT}/graphql`);
  });
});
