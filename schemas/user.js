//  controller
const userController = require('../controllers/user');

async function getUsersList() {
  const resp = await userController.getUsers();

  return resp;
}

async function getUser(parent, args) {
  const resp = await userController.getUser(args);

  return resp;
}

async function getProfile(parent, args, context) {
  const { user } = context;

  const resp = await userController.getUser({ id: user.id, email: user.email });

  return resp;
}

const typeDef = `
  extend type Query {
    users: [User]
    user(id: Int!): User
    profile: User
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
`;

const resolvers = {
  Query: {
    users: getUsersList,
    user: getUser,
    profile: getProfile,
  },
};

module.exports = {
  typeDef,
  resolvers,
};
