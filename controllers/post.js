const { Op } = require('sequelize');

//  models
const DB = require('../models');

const { Post, UserProfile } = DB;

module.exports = {
  create: async (data, user) => {
    try {
      const {
        title,
        description,
        location,
        thumbnail,
      } = data;

      const post = await Post.findOne({
        where: { title },
      });

      if (post) {
        return { post, create: !post };
      }

      const newPost = await Post.create({
        title,
        description,
        location,
        thumbnail,
        authorId: user.id,
      });

      return { post: newPost, created: true };
    } catch (e) {
      throw new Error(e.message);
    }
  },

  getAll: async () => {
    try {
      const posts = Post.findAll({ include: [{ model: UserProfile, as: 'author' }] });

      return posts;
    } catch (e) {
      throw new Error(e.message);
    }
  },
};
