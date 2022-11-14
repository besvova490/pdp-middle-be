const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

// services
const { sessionStore } = require('../services/redis');

// models
const DB = require('../models');

// helpers
const removeNested = require('../helpers/removeNested');
const { generateTokens } = require('../helpers/jwtTokensHelpers');

const { User, UserProfile, sequelize } = DB;

module.exports = {
  get: async ({ email, id = 0 }) => {
    try {
      const user = await User.findOne(
        {
          where: {
            [Op.or]: [
              { id },
              { email },
            ],
          },
          include: UserProfile,
        },
      );

      if (!user) return null;

      const session = await sessionStore.findSession(user.id);
      const profileToReturn = removeNested(user.toJSON(), {}, ['UserProfileId']);

      return { ...profileToReturn, id: user.UserProfileId, online: !!session?.connected };
    } catch (e) {
      throw new Error(e.message);
    }
  },

  create: async ({ email, password }) => {
    const transaction = await sequelize.transaction();

    try {
      const user = await User.findAll({ where: { email } });

      if (user.length) {
        await transaction.rollback();

        return { details: 'User with such email already exist', status: 400 };
      }

      const newProfile = await UserProfile.create({
        userName: `user-${uuidv4()}`,
      });

      const newUser = await User.create({
        email,
        password: bcrypt.hashSync(password, 10),
        UserProfileId: newProfile.id,
      });

      const { accessToken, refreshToken } = generateTokens({ id: newUser.id, email });

      await transaction.commit();

      return { accessToken, refreshToken, status: 201 };
    } catch (e) {
      await transaction.rollback();

      throw new Error(e.message);
    }
  },

  delete: async ({ id }) => {
    try {
      const resp = await User.destroy({
        where: { id },
      });

      return resp;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  update: async ({ id, ...rest }) => {
    try {
      const user = await User.findOne({ where: { id } });
      if (!user) return { user: null, updated: false };

      const profile = await user.getUserProfile();
      const resp = await profile.update(rest);

      return { user: resp, updated: true };
    } catch (e) {
      throw new Error(e.message);
    }
  },

  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({
        where: { email },
        include: UserProfile,
      });

      if (!user) return { details: 'User not found', error: true };
      if (!bcrypt.compareSync(password, user.password)) return { password: 'Invalid password', error: true };

      const profileToReturn = removeNested(user.toJSON(), {}, ['UserProfileId']);
      const { accessToken, refreshToken } = generateTokens({ id: profileToReturn.id, email: `${email}-12` });

      return { accessToken, refreshToken };
    } catch (e) {
      throw new Error(e.message);
    }
  },

  getUsers: async () => {
    try {
      const users = await User.findAll({ include: UserProfile });

      const userList = users.map((item) => removeNested(item.toJSON(), {}, ['UserProfileId']));
      return userList;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  search: async (query) => {
    try {
      const users = await UserProfile.findAll({ where: { userName: { [Op.like]: `%${query}%` } }, include: User });

      const userList = users.map(async (item) => {
        const session = await sessionStore.findSession(item.id);

        return {
          ...removeNested(item.toJSON(), {}, ['UserProfileId']),
          online: !!session,
        };
      });
      return userList;
    } catch (e) {
      throw new Error(e.message);
    }
  },
};
