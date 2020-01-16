const DATE = require("graphql-iso-date");

// Master for account reg
const MasterCode = 123983;

module.exports = {
  DATE,
  Query: {
    getRole: async (_, { id }, { database }) => {
      const role = await database.auth.getRole(id);
      return role;
    }
  },
  Mutation: {
    newUser: async (parent, { input }, { auth, database }) => {
      const { code, id } = input;
      const role = await database.auth.setRole({
        id,
        role: "user"
      });
      // if (code !== MasterCode) {
      //   throw new AuthenticationError("You must have a valid code to signup");
      // }
      return role;
    }
  }
};
