const router = require("express").Router();

const { fn, col, COUNT, SUM } = require("sequelize");

const { Blog } = require("../models");

router.get("/", async (_req, res) => {
  const authors = await Blog.findAll({
    group: ["author"],
    attributes: [
      "author",
      [fn("COUNT", col("title")), "articles"],
      [fn("SUM", col("likes")), "likes"],
    ],
    order: [["likes", "DESC"]],
  });

  res.status(200).json(authors);
});

module.exports = router;
