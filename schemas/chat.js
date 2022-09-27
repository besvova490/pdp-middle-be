const { UserInputError } = require('apollo-server-errors');

// controllers
const chatController = require('../controllers/chat');

async function getChat(_, data, context) {
  const { user } = context;
  const { id } = data;

  const resp = await chatController.get({ id, userId: user.id });

  return resp;
}

async function getChats(_, data, context) {
  const { user } = context;

  const resp = await chatController.getAll({ userId: user.id });

  return resp;
}

async function createChat(data, context) {
  const { user } = context;
  const { receiver, message } = data;

  const { chat, created } = await chatController.create({ initiator: user.id, receiver, message });

  if (!created) {
    throw new UserInputError(
      'Something went wrong',
    );
  }

  return chat;
}

async function deleteChat(data, context) {
  const { user } = context;
  const { id } = data;

  const resp = await chatController.delete({ id, userId: user.id });

  return resp;
}

const typeDef = `
  type Message {
    body: String
    createdAt: String
    author: User
    receiver: User
    chatId: Int
  }

  type Chat {
    id: Int
    messages: [Message]
    initiator: User
    receiver: User
    online: Boolean
  }

  extend type Query {
    chats: [Chat] @auth
    chat(id: Int!): Chat @auth
  }

  input CreateChat {
    receiver: Int
    message: String
  }

  extend type Mutation {
    createChat(data: CreateChat): Chat @auth
    deleteChat(id: Int): Int @auth
  }
`;

const resolvers = {
  Query: {
    chats: getChats,
    chat: getChat,
  },

  Mutation: {
    createChat: (_, args, context) => createChat(args.data, context),
    deleteChat: (_, args, context) => deleteChat(args, context),
  },
};

module.exports = {
  typeDef,
  resolvers,
};
