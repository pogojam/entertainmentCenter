const DATE = require("graphql-iso-date");
const genres = require("../../../routes/library/genres.json");

module.exports = {
  DATE,
  Query: {
    getMovies: async (obj, { input }, { database }) => {
      const movies = database.movie.getMovies(input);
      return movies;
    },
    getMovielist: (obj, { title }, { database }) => {
      const list = database.movie.getMovielist();
      return list;
    }
  },
  Mutation: {
    addMovie: (obj, { title }, { database }) => {
      database.movie.getMovie(title);
    }
  }
};
