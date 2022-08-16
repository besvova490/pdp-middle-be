const { Op } = require('sequelize');

//  models
const DB = require('../models');

const { Tag } = DB;

module.exports = {
  create: async ({ name }) => {
    try {
      const [tag, created] = await Tag.findOrCreate({
        where: { name },
        defaults: { name },
      });

      return { tag, created };
    } catch (e) {
      throw new Error(e.message);
    }
  },

  get: async ({ name = '', id = 0 }) => {
    try {
      const tag = await Tag.findOne({
        where: {
          [Op.or]: [
            { id },
            { name },
          ],
        },
      });

      return tag;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  getList: async () => {
    try {
      const tagsList = await Tag.findAll();

      return tagsList;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  delete: async ({ id = 0, name = '' }) => {
    try {
      const result = await Tag.destroy({
        where: {
          [Op.or]: [
            { id },
            { name },
          ],
        },
      });

      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  },
};
