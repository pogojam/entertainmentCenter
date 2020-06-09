const DATE = require("graphql-iso-date");
// Master for account reg
const MasterCode = 123983;

module.exports = {
  DATE,
  Query: {
    getUser: async (_, { id }, { database }) => {
      const user = await database.auth.getUser(id);
      return user;
    },
  },
  Mutation: {
    newUser: async (parent, { input }, { auth, database }) => {
      // const { code, id } = input;
      const user = await database.auth.addUser({
        id,
        role: "user",
        autoPay: false,
      });
      // if (code !== MasterCode) {
      //   throw new AuthenticationError("You must have a valid code to signup");
      // }
      return user;
    },
    createSubscription: async (
      parent,
      { token },
      { auth, stripe, user, database }
    ) => {
      const { uid } = user;
      try {
        const customer = await stripe.customers.create({
          source: token,
          email: auth.email,
        });
        database.auth.updateUser(uid, {
          autoPay: true,
          customerId: customer.id,
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
