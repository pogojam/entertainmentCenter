const DATE = require("graphql-iso-date");
const axio = require("axios");

console.log(process.env.OMBD);
const omdbPath = `http://www.omdbapi.com/?apikey=${process.env.OMBD}&`;

const getMovie = title => {
  axio.get(omdbPath + "t=" + title).then(({ data }) => {
    if (data.Error) return data.Error;
    return data;
  });
};

module.exports = {
  DATE,
  Query: {
    getMovies: async (obj, query, { database }) => {
      const movies = [];
      const snapshot = await database.collection("movies").get();
      snapshot.forEach(e => movies.push(e.data()));
      return movies;
    }
  },
  Mutation: {
    addMovie: (obj, { title }, { database }) => {
      getMovie(title);
    }
  }
};
