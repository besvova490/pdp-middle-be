const { UserInputError, ApolloError } = require('apollo-server-errors');

//  controller
const tagController = require('../controllers/tag');

async function getTagsList() {
  const resp = await tagController.getList();

  return resp;
}

async function getTag(parent, args) {
  const resp = await tagController.get(args);

  return resp;
}

async function create({ name }) {
  const { tag, created } = await tagController.create({ name });

  if (!created) {
    throw new UserInputError(
      'Tag already exist',
    );
  }

  return tag;
}

async function deleteTag({ name, id }) {
  const resp = await tagController.delete({ name, id });

  if (!resp) {
    throw new ApolloError(
      'Not Found',
      'PERSISTED_QUERY_NOT_FOUND',
      {
        details: 'Such tag is not exist',
      },
    );
  }

  return id;
}

const typeDef = `
  type Tag {
    id: Int!
    name: String
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    tags: [Tag]
    tag(id: Int!): Tag
  }

  extend type Mutation {
    createTag(name: String): Tag
    deleteTag(name: String, id: Int): Int
  }
`;

const resolvers = {
  Query: {
    tags: getTagsList,
    tag: getTag,
  },

  Mutation: {
    createTag: (_, data) => create(data),
    deleteTag: (_, data) => deleteTag(data),
  },
};

module.exports = {
  typeDef,
  resolvers,
};
