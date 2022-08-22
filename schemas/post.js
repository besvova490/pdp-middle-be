const { UserInputError, ApolloError } = require('apollo-server-errors');

//  controller
const postController = require('../controllers/post');

async function getPost(_, data) {
  const resp = await postController.get(data);

  return resp;
}

async function getPostsList() {
  const resp = await postController.getAll();

  return resp;
}

async function create(data, context) {
  const { user } = context;

  const { post, created } = await postController.create(data, user);

  if (!created) {
    throw new UserInputError(
      'Post with such title already exist',
    );
  }

  return post;
}

async function update(data) {
  const { id, ...rest } = data;

  const { post, updated } = await postController.update(id, rest);

  if (!updated) {
    throw new ApolloError(
      'Not Found',
      'PERSISTED_QUERY_NOT_FOUND',
      {
        details: 'Such post is not exist',
      },
    );
  }

  return post;
}

async function deletePost({ id }) {
  const resp = await postController.delete({ id });

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

async function addComment(data, context) {
  const { user } = context;
  const { id, comment } = data;

  const resp = await postController.addComment({ postId: id, comment, authorId: user.id });

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

async function getComments(postId) {
  const comments = await postController.getComments({ id: postId });

  return comments;
}

const typeDef = `
  type Comment {
    body: String
    createdAt: String
    updatedAt: String
    author: User
  }

  type Post @auth {
    id: Int
    thumbnail: String
    title: String
    description: String
    location: String
    createdAt: String
    updatedAt: String
    author: User
    tags: [Tag]
    comments: [Comment]
  }

  extend type Query {
    posts: [Post]
    post(id: Int!): Post
  }

  input CreatePostInput {
    title: String!
    description: String
    thumbnail: String
    location: String
    tags: [Int]
  }

  input UpdatePostInput {
    id: Int!
    description: String
    thumbnail: String
    location: String
    tags: [Int]
  }

  extend type Mutation {
    createPost(data: CreatePostInput): Post @auth
    updatePost(data: UpdatePostInput): Post @auth
    deletePost(id: Int!): Int @auth
    addComment(id: Int!, comment: String!): Int @auth
  }
`;

const resolvers = {
  Query: {
    posts: getPostsList,
    post: getPost,
  },

  Post: {
    comments: (parent) => getComments(parent.id),
  },

  Mutation: {
    createPost: (_, data, context) => create(data, context),
    updatePost: (_, data) => update(data),
    deletePost: (_, data) => deletePost(data),
    addComment: (_, data, context) => addComment(data, context),
  },
};

module.exports = {
  typeDef,
  resolvers,
};
