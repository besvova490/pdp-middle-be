const { Router } = require('express');

// middleware
const validation = require('../middleware/validation');
const userValidation = require('../middleware/validationSchemas/user.schema');
const authMiddleware = require('../middleware/protect');

//  controller
const userController = require('../controllers/user');

// helpers
const { verifyToken } = require('../helpers/jwtTokensHelpers');

const authRouter = Router();

authRouter.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.user;

    const {
      accessToken,
      refreshToken,
      error,
      password: passwordError,
      details,
    } = await userController.login({ email, password });

    if (error && details) {
      return res.status(404).json({ details });
    }
    if (error && passwordError) {
      return res.status(403).json({ password: passwordError });
    }

    return res.status(200).json({ accessToken, refreshToken });
  } catch (e) {
    next(new Error(e.message));
  }
});
authRouter.post('/register', validation(userValidation.create), async (req, res, next) => {
  try {
    const { email, password } = req.user;

    const { status, ...rest } = await userController.create({ email, password });

    res.status(status).json(rest);
  } catch (e) {
    next(new Error(e.message));
  }
});

authRouter.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { email } = req.user;

    const user = await userController.get({ email });

    res.status(200).json(user);
  } catch (e) {
    next(new Error(e.message));
  }
});

authRouter.patch('/profile', [authMiddleware, validation(userValidation.update)], async (req, res, next) => {
  try {
    const { id } = req.user;
    const data = req.body || {};

    const resp = await userController.update({ id, ...data });

    if (resp === 0) return res.status(400).json({ detail: 'Such user not exist' });

    res.status(200).json({ id: resp });
  } catch (e) {
    next(new Error(e.message));
  }
});

authRouter.delete('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.user;

    const resp = await userController.delete({ id });

    if (resp === 0) return res.status(400).json({ detail: 'Such user not exist' });

    res.status(204).json({ id: resp });
  } catch (e) {
    next(new Error(e.message));
  }
});

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ detail: 'No refresh token has been provided' });

    verifyToken(
      refreshToken,
      ({
        accessToken,
        refreshToken: refreshTokenNew,
      }) => res.status(200).json({ accessToken, refreshToken: refreshTokenNew }),
      (e) => res.status(401).json({ detail: e }),
    );
  } catch (e) {
    next(new Error(e.message));
  }
});

module.exports = authRouter;
