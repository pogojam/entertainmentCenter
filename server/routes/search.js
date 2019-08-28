const express = require("express");
const axios = require("axios");
const genres = require("./library/genres.json");
const searchRouter = express();

searchRouter.get("/genre", (req, res) => {
  console.log(genres);
  axios.get("");
});

module.exports = { searchRouter };
