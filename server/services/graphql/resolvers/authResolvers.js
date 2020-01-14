const DATE = require("graphql-iso-date");
const genres = require("../../../routes/library/genres.json");
const _ = require("lodash");
const crypto = require("crypto");
const uuid = require("uuid");

// Master for account reg

const MasterCode = 123983;

module.exports = {
  DATE,
  Query: {},
  Mutation: {
    newUser: async (parent, { input }, { auth, database }) => {
      const { code, firstName, id } = input;

      console.log(id);

      const user = await database
        .collection("roles")
        .doc(id)
        .set({
          id,
          firstName,
          role: "user"
        });

      // if (code !== MasterCode) {
      //   throw new AuthenticationError("You must have a valid code to signup");
      // }

      return {
        firstName: "Hi"
      };
    }
  }
};
