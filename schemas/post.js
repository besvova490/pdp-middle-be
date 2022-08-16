const { UserInputError, ApolloError } = require('apollo-server-errors');

//  controller
const postController = require('../controllers/post');

async function getPostsList() {
  const resp = await postController.getAll();

  return resp;
}

async function create(data, context) {
  const { user } = context;

  const { post, created } = await postController.create(data, user);

  if (!created) {
    throw new UserInputError(
      'Tag already exist',
    );
  }

  return post;
}

const typeDef = `
  type Post {
    id: Int
    thumbnail: String,
    title: String,
    description: String,
    location: String,
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    posts: [Post]
  }

  extend type Mutation {
    createPost(title: String, description: String, thumbnail: String, location: String): Post
  }
`;

const resolvers = {
  Query: {
    posts: getPostsList,
  },

  Mutation: {
    createPost: (_, data, context) => create(data, context),
  },
};

module.exports = {
  typeDef,
  resolvers,
};
