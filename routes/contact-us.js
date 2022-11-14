const { Router } = require('express');

// controllers
const contactRequestsController = require('../controllers/contact-us');

const ContactUsRouter = Router();

ContactUsRouter.get('/', async (req, res) => {
  const posts = await contactRequestsController.getAll();

  return res.status(200).json(posts);
});

ContactUsRouter.post('/', async (req, res) => {
  const posts = await contactRequestsController.create(req.body);

  return res.status(200).json(posts);
});

module.exports = ContactUsRouter;
