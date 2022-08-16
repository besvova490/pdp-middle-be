const { Sequelize } = require('sequelize');

// configs
const config = require('../config/config');

const {
  host, port, username, password, database, dialect,
} = config[process.env.EXPRESS_NODE_ENV];

const sequelize = new Sequelize({
  host,
  port,
  dialect,
  username,
  password,
  database,
});

async function connectionCheck() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ logging: () => null });

    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = {
  dbConnection: sequelize,
  connectionCheck,
};
