const { ObjectId } = require("mongodb");
const { hashPassword, comparePass } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type User {
    _id: ID!
    name: String
    username: String!
    email: String
  }

  input CreateUserInput {
    name: String
    username: String!
    email: String!
    password: String!
  }

  type AuthPayload {
    access_token: String!
  }

  input LoginUserInput {
    username: String
    password: String
  }


  type Query {
    getUsers: [User]
    getUserById(id: ID!): User 
    getUsersByUsername(username: String) : User
  
  }

  type Mutation {
    createUser(input: CreateUserInput): User
    loginuser(input: LoginUserInput!): AuthPayload
  }
`;

const resolvers = {
  Query: {
    getUsers: async (_, args, { db }) => {
      const users = await db.collection("users").find().toArray();
      return users.map((user) => ({
        ...user,
        _id: user._id.toString(), // Assuming _id is of type ObjectId
      }));
    },
    getUserById: async (_, args, contextValue) => {
      console.log(args, "ini args by id");
      const { db } = contextValue;
      const { id } = args;

      const users = db.collection("users");
      const findUserById = await users.findOne({
        _id: new ObjectId(id),
      });

      console.log(findUserById, "sampe sini");
      return findUserById;
    },
    getUsersByUsername: async (_, args, contextValue) => {
      const { db } = contextValue;
      const { username } = args;

      const users = db.collection("users");
      const findUserByUsername = await users.findOne({ username });

      console.log(findUserByUsername, "ini username bro");
      return findUserByUsername;
    },
  },
  Mutation: {
    createUser: async (_, args, contextValue) => {
      console.log(args, "ini args");

      const { db } = contextValue;
      const { name, username, email, password } = args.input;

      const users = db.collection("users");
      const hashedPassword = hashPassword(args.input.password);

      const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      if (!isValidEmail(email)) {
        throw new Error("Email format is invalid");
      }

      const checkUsername = await users.findOne({ username });
      const checkEmail = await users.findOne({ email });

      if (checkUsername) {
        throw new Error("Username must be unique");
      }

      if (checkEmail) {
        throw new Error("Email must be unique");
      }

      if (password.length < 5) {
        throw new Error("Password minimal 5 characters");
      }

      const newUser = await users.insertOne({
        ...args.input,
        password: hashedPassword,
      });

      return {
        ...args.input,
        _id: newUser.insertedId,
      };
    },
    loginuser: async (_, args, contextValue) => {
      console.log(args, "ini args/body");

      const { db } = contextValue;
      const { username, password } = args.input;

      const user = db.collection("users");
      const loginUser = await user.findOne({ username });
      if (!loginUser) {
        console.log("username gada");
        throw { name: "INVALIDUSERNAMEPASS" };
      }

      const comparingPass = comparePass(password, loginUser.password);

      if (!comparingPass) {
        console.log("pass salah");
        throw { name: "INVALIDUSERNAMEPASS" };
      }

      let access_token = signToken({
        id: loginUser._id,
        username: loginUser.username,
      });

      console.log(comparingPass, "pass betul");
      return {
        access_token,
      };
    },
  },
};

module.exports = { typeDefs, resolvers };
