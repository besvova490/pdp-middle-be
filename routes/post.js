const { Router } = require('express');

// controllers
const postController = require('../controllers/post');

const postsRouter = Router();

postsRouter.get('/', async (req, res) => {
  const posts = await postController.getAll();

  return res.status(200).json(posts);
});

module.exports = postsRouter;
