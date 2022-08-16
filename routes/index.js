const router = require('express').Router();

// routes
const auth = require('./auth');

router.use('/auth', auth);
router.use('*', (_, res) => res.status(404).json({ msg: 'Page not found' }));

module.exports = router;
