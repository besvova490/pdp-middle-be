const { Op } = require('sequelize');

// helpers
const removeNested = require('../helpers/removeNested');

// services
const { messageStore, sessionStore } = require('../services/redis');

//  models
const DB = require('../models');

const {
  Chat,
  User,
  UserProfile,
} = DB;

module.exports = {
  create: async ({ receiver, message, initiator }) => {
    try {
      const userReceiver = await UserProfile.findOne({ where: { id: initiator } });

      if (!userReceiver) return { created: false, chat: null };

      const chat = await Chat.create({
        receiverId: receiver,
        initiatorId: initiator,
      });

      if (message) {
        messageStore.saveMessage(chat.id, {
          receiver,
          author: initiator,
          body: message,
          chatId: chat.id,
          createdAt: new Date(),
        });
      }

      return { created: chat, chat };
    } catch (e) {
      throw new Error(e.message);
    }
  },

  get: async ({ id, userId }) => {
    try {
      const chat = await Chat.findOne({
        where: { id },
        include: [
          { model: UserProfile, as: 'initiator', include: [User] },
          { model: UserProfile, as: 'receiver', include: [User] },
        ],
      });

      const chatToJson = chat.toJSON();
      const messages = await messageStore.findMessagesForUser(chat.id);

      const receiver = removeNested(chatToJson.receiver, {});
      const initiator = removeNested(chatToJson.initiator, {});
      const isOwn = initiator.id === userId;

      return {
        ...chatToJson,
        messages,
        isOwn,
        receiver: isOwn ? receiver : initiator,
        initiator,
      };
    } catch (e) {
      throw new Error(e.message);
    }
  },

  getByReceiver: async ({ id }) => {
    try {
      const chat = await Chat.findOne({ where: { receiverId: id } });

      const chatToJson = chat.toJSON();

      return removeNested(chatToJson);
    } catch (e) {
      throw new Error(e.message);
    }
  },

  getAll: async ({ userId }) => {
    try {
      const chats = await Chat.findAll({
        where: {
          [Op.or]: [
            { initiatorId: userId },
            { receiverId: userId },
          ],
        },
        include: [
          { model: UserProfile, as: 'initiator', include: [User] },
          { model: UserProfile, as: 'receiver', include: [User] },
        ],
      });

      const chatsList = chats.map(async (item) => {
        const itemToReturn = item.toJSON();
        const messages = await messageStore.findMessagesForUser(item.id);
        const session = await sessionStore.findSession(itemToReturn.receiverId);

        const receiver = removeNested(itemToReturn.receiver, {});
        const initiator = removeNested(itemToReturn.initiator, {});
        const isOwn = initiator.id === userId;

        return {
          ...itemToReturn,
          isOwn,
          receiver: isOwn ? receiver : initiator,
          initiator,
          online: !!session,
          messages,
        };
      });

      return chatsList;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  delete: async ({ id, userId }) => {
    try {
      const resp = await Chat.destroy({ where: { id, initiatorId: userId } });

      return resp;
    } catch (e) {
      throw new Error(e.message);
    }
  },
};
