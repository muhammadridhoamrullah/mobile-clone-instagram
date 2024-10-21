if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const {
  typeDefs: typeDefsUser,
  resolvers: resolversUser,
} = require("./schemas/users");

const {
  typeDefs: typeDefsPost,
  resolvers: resolversPost,
} = require("./schemas/post");

const {
  typeDefs: typeDefsFollow,
  resolvers: resolversFollow,
} = require("./schemas/follow");

const { connect, getDB } = require("./config/mongo");
const auth = require("./middlewares/authentication");

const server = new ApolloServer({
  typeDefs: [typeDefsUser, typeDefsPost, typeDefsFollow],
  resolvers: [resolversUser, resolversPost, resolversFollow],
  introspection: true,
});

async function startServer() {
  try {
    await connect();

    const db = await getDB();

    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
      context: async ({ req }) => ({
        db,
        authentication: () => auth(req, db),
      }),
    });

    console.log(`Server ready at: ${url}`);
  } catch (error) {
    console.log(`Error : ${error}`);
  }
}

startServer();
