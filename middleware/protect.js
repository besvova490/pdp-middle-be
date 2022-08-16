require('dotenv').config();

const JWT = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authToken = req.headers.authorization;
  const token = authToken && authToken.split(' ')[1];

  if (!token) return res.status(401).json({ detail: 'No access token has been provided' });

  JWT.verify(token, process.env.EXPRESS_APP_JWT_ACCESS_SECRET, (e, user) => {
    if (e) return res.status(401).json({ detail: e });

    req.user = user;

    if (next) {
      next();
    }
  });
};

module.exports = authMiddleware;
