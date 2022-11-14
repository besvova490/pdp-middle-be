const expressRateLimit = require('express-rate-limit');
const JWT = require('jsonwebtoken');

const rateLimit = expressRateLimit({
  windowMs: 20 * 1000, // 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  max: async (req) => {
    const authToken = req.headers.authorization;
    const token = authToken && authToken.split(' ')[1];

    return JWT.verify(token || '', process.env.EXPRESS_APP_JWT_ACCESS_SECRET, (e, user) => {
      if (user && !e) {
        return 5;
      }

      return 2;
    });
  },
});

module.exports = rateLimit;
