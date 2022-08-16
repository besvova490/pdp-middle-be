const JWT = require('jsonwebtoken');

function generateTokens({ id, email }) {
  const expirationAccess = process.env.EXPRESS_APP_JWT_ACCESS_EXPIRATION_TIME;
  const expirationRefresh = process.env.EXPRESS_APP_JWT_REFRESH_EXPIRATION_TIME;

  const accessToken = JWT.sign(
    { id, email },
    process.env.EXPRESS_APP_JWT_ACCESS_SECRET,
    { expiresIn: +expirationAccess },
  );
  const refreshToken = JWT.sign(
    { id, email },
    process.env.EXPRESS_APP_JWT_REFRESH_SECRET,
    { expiresIn: +expirationRefresh },
  );

  return { accessToken, refreshToken };
}

function verifyToken(refreshToken, callback, errorCallback) {
  JWT.verify(refreshToken, process.env.EXPRESS_APP_JWT_REFRESH_SECRET, async (e, user) => {
    if (e) return errorCallback(e);

    const {
      accessToken,
      refreshToken: refreshTokenNew,
    } = generateTokens({ id: user.id, email: user.email });

    return callback({ accessToken, refreshToken: refreshTokenNew });
  });
}

module.exports = {
  generateTokens,
  verifyToken,
};
