const { ApolloServer, gql } = require("apollo-server-express");
const path = require("path");
const {
  mergeTypes,
  mergeResolvers,
  fileLoader,
} = require("merge-graphql-schemas");
const { auth } = require("./firebase");
const { database } = require("./database");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const context = async ({ req }) => {
  const token = req.headers.authorization;
  let user = null;

  if (token) {
    try {
      const { uid } = await auth.verifyIdToken(token);
      const { role } = await database.auth.getUser([uid]);

      user = {
        uid,
        role,
      };
    } catch (error) {
      console.log(error);
    }
  }
  return { database, auth, user, stripe };
};

const typeDefs = mergeTypes(
  fileLoader(path.join(__dirname, "./graphql/types"))
);

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./graphql/resolvers"))
);

const server = new ApolloServer({ typeDefs, resolvers, context });

module.exports = server;
