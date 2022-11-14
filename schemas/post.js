const { UserInputError, ApolloError } = require('apollo-server-errors');
const { withFilter } = require('graphql-subscriptions');

//  controller
const postController = require('../controllers/post');

// services
const PubSub = require('../services/pub-sub');

async function getPost(_, data) {
  const resp = await postController.get(data);

  return resp;
}

async function getPostsList() {
  const resp = await postController.getAll();

  return resp;
}

async function getUserPosts(_, args, context) {
  const { user } = context;

  const resp = await postController.getAllUserPosts(user.id);

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

  PubSub.publish('COMMENTS_SUBSCRIPTION', { newCommentAtPost: resp });

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

  type CommentNotification {
    id: Int!
    body: String!
    createdAt: String!
    author: Int!
    postTitle: String!
    postId: Int!
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
    myPosts: [Post] @auth
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

  extend type Subscription {
    newCommentAtPost: CommentNotification
  }
`;

const resolvers = {
  Query: {
    posts: getPostsList,
    post: getPost,
    myPosts: getUserPosts,
  },

  Post: {
    comments: (parent) => getComments(parent.id),
  },

  Mutation: {
    createPost: (_, args, context) => create(args.data, context),
    updatePost: (_, data) => update(data),
    deletePost: (_, data) => deletePost(data),
    addComment: (_, data, context) => addComment(data, context),
  },

  Subscription: {
    newCommentAtPost: {
      subscribe: withFilter(
        () => PubSub.asyncIterator('COMMENTS_SUBSCRIPTION'),
        (data, _, context) => (data.newCommentAtPost.author === context.user.id),
      ),
    },
  },
};

module.exports = {
  typeDef,
  resolvers,
};
