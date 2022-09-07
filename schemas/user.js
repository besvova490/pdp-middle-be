const { UserInputError, ApolloError } = require('apollo-server-errors');

//  controller
const userController = require('../controllers/user');

// helpers
const { verifyToken } = require('../helpers/jwtTokensHelpers');

async function getUsersList() {
  const resp = await userController.getUsers();

  return resp;
}

async function getUser(_, args) {
  const resp = await userController.getUser(args);

  return resp;
}

async function getProfile(_, args, context) {
  const { user } = context;

  const resp = await userController.getUser({ id: user.id, email: user.email });

  return resp;
}

async function login(_, args) {
  const { email, password } = args.data;

  const {
    accessToken,
    refreshToken,
    error,
    password: passwordError,
    details,
  } = await userController.login({ email, password });

  if (error && details) {
    throw new UserInputError(details, { details });
  }
  if (error && passwordError) {
    throw new UserInputError(passwordError, { password: passwordError });
  }

  return {
    accessToken,
    refreshToken,
  };
}

async function create(_, args) {
  const { email, password } = args.data;

  const {
    accessToken,
    refreshToken,
    details,
  } = await userController.create({ email, password });

  if (details) {
    throw new UserInputError(details, { details });
  }

  return {
    accessToken,
    refreshToken,
  };
}

async function refresh(_, args) {
  const { refreshToken } = args;

  const {
    accessToken,
    refreshToken: refreshTokenNew,
  } = await verifyToken(refreshToken).catch((e) => {
    throw new UserInputError(e.message, { detail: e });
  });

  return {
    accessToken,
    refreshToken: refreshTokenNew,
  };
}

async function updateProfile(_, args, context) {
  const { user, updated } = await userController.update({ id: context.user.id, ...args.data })
    .catch((e) => {
      throw new UserInputError(e.message, { detail: e });
    });

  if (!updated) {
    throw new ApolloError(
      'Such user is not exist',
      'PERSISTED_QUERY_NOT_FOUND',
      {
        details: 'Such user is not exist',
      },
    );
  }

  return user;
}

const typeDef = `
  extend type Query {
    users: [User] @auth
    user(id: Int!): User @auth
    profile: User @auth
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ProfileInput {
    email: String
    avatar: String
    thumbnailImage: String
    userName: String
    fullName: String
    description: String
    address: String
    phone: String
  }

  type Tokens {
    accessToken: String
    refreshToken: String
  }

  type User {
    id: Int
    email: String
    avatar: String
    thumbnailImage: String
    userName: String
    fullName: String
    description: String
    address: String
    phone: String
    createdAt: String
    updatedAt: String
  }

  extend type Mutation {
    login(data: LoginInput): Tokens
    register(data: LoginInput): Tokens
    refresh(refreshToken: String): Tokens
    profile(data: ProfileInput): User @auth
  }
`;

const resolvers = {
  Query: {
    users: getUsersList,
    user: getUser,
    profile: getProfile,
  },

  Mutation: {
    login,
    register: create,
    refresh,
    profile: updateProfile,
  },
};

module.exports = {
  typeDef,
  resolvers,
};
