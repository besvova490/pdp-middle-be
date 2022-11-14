//  models
const DB = require('../models');

const { ContactRequests } = DB;

module.exports = {
  create: async ({ name, email, message }) => {
    try {
      const newContactRequest = await ContactRequests.create({
        name,
        email,
        message,
      });

      return newContactRequest;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  getAll: async () => {
    try {
      const newContacts = await ContactRequests.findAll({ raw: true, nest: true });

      return newContacts;
    } catch (e) {
      throw new Error(e.message);
    }
  },
};
