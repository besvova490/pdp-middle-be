const router = require('express').Router();

// middleware
const rateLimit = require('../middleware/rateLimit');

// routes
const auth = require('./auth');
const withRateLimitRouter = require('./with-rate-limit');
const postsRouter = require('./post');
const ContactUsRouter = require('./contact-us');

router.use('/auth', auth);
router.use('/posts', postsRouter);
router.use('/contact-us', ContactUsRouter);
router.use('/with-rate-limit', rateLimit, withRateLimitRouter);
router.use('*', (_, res) => res.status(404).json({ msg: 'Page not found' }));

module.exports = router;
