const DATE = require("graphql-iso-date");
const axio = require("axios");
const genres = require("../../../routes/library/genres.json");
const _ = require("lodash");

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
    getMovies: async (obj, { input }, { database }) => {
      const movies = [];
      const snapshot = await database.collection("movies").get();
      // const snapshot = await database
      //   .collection("movies")
      //   .where("Genre", "array-contains", input)
      //   .get();

      snapshot.forEach(e => {
        if (e.data().Genre.includes(input)) {
          movies.push(e.data());
        }
      });
      return movies;
    },
    getMovielist: (obj, { title }, { database }) => {
      const extension = "/genre/movie/list";

      console.log(genres);
      try {
        const data = axio.get(omdbPath + extension);
      } catch (err) {
        console.log(err);
      }
    }
  },
  Mutation: {
    addMovie: (obj, { title }, { database }) => {
      getMovie(title);
    }
  }
};
