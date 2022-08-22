const merge = require('lodash/merge');
const { makeExecutableSchema } = require('@graphql-tools/schema');

// schemas
const userSchema = require('./user');
const tagSchema = require('./tag');
const postSchema = require('./post');

// helpers
const authDirective = require('../middleware/authDirective');

const Query = `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective('auth');

const resolvers = {};
const typeDefs = [
  authDirectiveTypeDefs,
  Query,
  userSchema.typeDef,
  tagSchema.typeDef,
  postSchema.typeDef,
];

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: merge(resolvers, userSchema.resolvers, tagSchema.resolvers, postSchema.resolvers),
});

module.exports = authDirectiveTransformer(schema);
