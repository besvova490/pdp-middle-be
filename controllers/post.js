const { Op } = require('sequelize');

// helpers
const removeNested = require('../helpers/removeNested');

//  models
const DB = require('../models');

const {
  Post,
  UserProfile,
  Tag,
  User,
  Comment,
  sequelize,
} = DB;

module.exports = {
  create: async (data, user) => {
    try {
      const {
        title,
        description,
        location,
        thumbnail,
        tags = [],
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

      await newPost.setTags(tags);

      return { post: newPost, created: true };
    } catch (e) {
      throw new Error(e.message);
    }
  },

  update: async (id, data) => {
    try {
      const {
        description,
        location,
        thumbnail,
        tags,
      } = data;

      const post = await Post.findOne({ where: { id } });

      if (!post) {
        return { post: null, updated: false };
      }

      const updatePost = await post.update({
        description,
        location,
        thumbnail,
      });

      if (tags) {
        await post.setTags(tags);
      }

      return { post: updatePost, updated: true };
    } catch (e) {
      throw new Error(e.message);
    }
  },

  delete: async ({ id = 0 }) => {
    try {
      const result = await Post.destroy({
        where: { id },
      });

      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  get: async ({ id = 0, title = '' }) => {
    try {
      const post = await Post.findOne({
        where: {
          [Op.or]: [
            { id },
            { title },
          ],
        },
        include: [
          { model: UserProfile, as: 'author', include: [User] },
          { model: Tag, as: 'tags' },
        ],
      });

      const postToJson = post.toJSON();

      return {
        ...postToJson,
        author: removeNested(postToJson.author, {}, ['UserProfileId', 'password']),
      };
    } catch (e) {
      throw new Error(e.message);
    }
  },

  getComments: async ({ id = 0, title = '' }) => {
    try {
      const post = await Post.findOne({
        where: {
          [Op.or]: [
            { id },
            { title },
          ],
        },
      });

      const comments = await post.getComments({
        include: [{ model: UserProfile, as: 'author', include: [User] }],
      });

      const commentsList = comments.map((item) => {
        const itemToReturn = item.toJSON();

        return {
          ...itemToReturn,
          author: removeNested(itemToReturn.author, {}, ['UserProfileId', 'password']),
        };
      });

      return commentsList;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  getAll: async () => {
    try {
      const posts = await Post.findAll({
        include: [
          { model: UserProfile, as: 'author', include: [User] },
          { model: Tag, as: 'tags' },
        ],
      });

      const postsList = posts.map((item) => {
        const itemToReturn = item.toJSON();

        return {
          ...itemToReturn,
          author: removeNested(itemToReturn.author, {}, ['UserProfileId', 'password']),
        };
      });

      return postsList;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  addComment: async ({ postId, comment, authorId }) => {
    const transaction = await sequelize.transaction();

    try {
      const post = await Post.findOne({ where: { id: postId } });

      if (!post) return null;

      const newComment = await Comment.create({
        body: comment,
        postId,
        authorId,
      });

      await post.addComment(newComment);

      await transaction.commit();

      return true;
    } catch (e) {
      await transaction.rollback();

      throw new Error(e.message);
    }
  },
};
