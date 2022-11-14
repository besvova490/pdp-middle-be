const { Router } = require('express');

const withRateLimitRouter = Router();

withRateLimitRouter.post('/', (req, res) => {
  const { message } = req.body;

  return res.status(200).json({ message });
});

module.exports = withRateLimitRouter;
