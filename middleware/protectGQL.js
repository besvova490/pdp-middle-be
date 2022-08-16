require('dotenv').config();

const { AuthenticationError } = require('apollo-server-express');

const JWT = require('jsonwebtoken');

const authMiddlewareGQL = ({ req }) => {
  const authToken = req.headers.authorization;
  const token = authToken && authToken.split(' ')[1];

  if (!token) throw new AuthenticationError('you must be logged in');

  return JWT.verify(token, process.env.EXPRESS_APP_JWT_ACCESS_SECRET, (e, user) => {
    if (e) throw new AuthenticationError(e);

    return { user };
  });
};

module.exports = authMiddlewareGQL;
