const merge = require('lodash/merge');
const { makeExecutableSchema } = require('@graphql-tools/schema');

// schemas
const userSchema = require('./user');
const tagSchema = require('./tag');
const postSchema = require('./post');
const chatSchema = require('./chat');

// helpers
const authDirective = require('../middleware/authDirective');

const Query = `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`;

const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective('auth');

const resolvers = [
  userSchema.resolvers,
  tagSchema.resolvers,
  postSchema.resolvers,
  chatSchema.resolvers,
];
const typeDefs = [
  authDirectiveTypeDefs,
  Query,
  userSchema.typeDef,
  tagSchema.typeDef,
  postSchema.typeDef,
  chatSchema.typeDef,
];

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: merge({}, ...resolvers),
});

module.exports = authDirectiveTransformer(schema);
