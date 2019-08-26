const express = require("express");
const axios = require("axios");

const searchRouter = express();

searchRouter.get("/genre", (req, res) => {
  axios.get("");
});

module.exports = { searchRouter };
