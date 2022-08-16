const merge = require('lodash/merge');
const { makeExecutableSchema } = require('@graphql-tools/schema');

// schemas
const userSchema = require('./user');
const tagSchema = require('./tag');
const postSchema = require('./post');

const Query = `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const resolvers = {};

const schema = makeExecutableSchema({
  typeDefs: [Query, userSchema.typeDef, tagSchema.typeDef, postSchema.typeDef],
  resolvers: merge(resolvers, userSchema.resolvers, tagSchema.resolvers, postSchema.resolvers),
});

module.exports = schema;
