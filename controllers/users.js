const bcrypt = require("bcrypt");
const { Op, where } = require("sequelize");
const router = require("express").Router();
const { User, Blog } = require("../models");

router.get("/", async (_req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: ["title", "author", "url", "likes"],
      as: "createdBlogs",
    },
    attributes: {
      exclude: ["passwordHash"],
    },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  if (!password || password.length < 3 || !username || !name) {
    throw { name: "WrongArgumentsError" };
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const savedUser = await User.create({
    username,
    name,
    passwordHash,
  });

  res.status(201).json(savedUser);
});

router.get("/:id", async (req, res) => {
  const read = req.query.read;

  if (read !== "true" && read !== "false" && read !== undefined) {
    throw { name: "WrongArgumentsError" };
  }

  // https://stackoverflow.com/a/42246755
  const whereStatement = {};

  if (read === "true") {
    whereStatement.read = true;
  } else if (read === "false") {
    whereStatement.read = false;
  } else {
    whereStatement.read = {
      [Op.or]: [true, false],
    };
  }

  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        attributes: ["title", "author", "url", "likes"],
        as: "createdBlogs",
      },
      {
        model: Blog,
        attributes: ["id", "url", "title", "author", "likes", "year"],
        as: "readings",
        through: {
          attributes: ["read", "id"],
          where: whereStatement,
        },
      },
    ],
    attributes: {
      exclude: ["passwordHash"],
    },
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put("/:username", async (req, res) => {
  const username = req.params.username;

  // in case the user does not exist
  if (!(await User.findOne({ where: { username } }))) {
    throw { name: "NotFoundError" };
  }

  const newUsername = req.body.username;

  // if the new username is not provided or is not a string
  if (
    !newUsername ||
    newUsername.length === 0 ||
    typeof newUsername !== "string"
  ) {
    throw { name: "WrongArgumentsError" };
  }

  // perform update
  const user = await User.findOne({ where: { username } });
  user.username = newUsername;
  await user.save();

  // log success
  console.log("User updated successfully");
  res.json(user);
});

module.exports = router;
