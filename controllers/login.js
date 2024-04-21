const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const { User, Session } = require("../models/");

router.post("/", async (request, response) => {
  const body = request.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  const valid = (seconds) => {
    const now = new Date();
    now.setSeconds(now.getSeconds() + seconds);
    return now.toISOString();
  };

  await Session.create({
    userId: userForToken.id,
    token: token,
    validUntil: valid(60),
  });

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = router;
