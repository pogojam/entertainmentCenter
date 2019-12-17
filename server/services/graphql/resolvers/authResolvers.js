const DATE = require("graphql-iso-date");
const genres = require("../../../routes/library/genres.json");
const _ = require("lodash");

const MasterCode = 123983;

module.exports = {
  DATE,
  Query: {},
  Mutation: {
    newUser: (parent, { code }, { auth }) => {
      // if (code !== MasterCode) {
      //   throw new AuthenticationError("You must have a valid code to signup");
      // }

      return {
        firstName: "Hi"
      };
    }
  }
};
