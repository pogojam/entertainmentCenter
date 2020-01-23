const DATE = require("graphql-iso-date");

module.exports = {
  DATE,
  Query: {
    getChores: async (parent, { start, end }, { auth, database }) => {
      const chores = await database.chore.getChores({
        start,
        end
      });
      return chores;
    }
  },
  Mutation: {
    addChore: async (parent, { input }, { auth, database }) => {
      const { chore, date, user } = input;
      const newChore = await database.chore.setChore({
        chore,
        date,
        user
      });

      console.log(chore);

      return newChore;
    }
  }
};
