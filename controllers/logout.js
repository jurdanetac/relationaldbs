const { Session } = require("../models/");
const { tokenExtractor } = require("../util/middleware");

const router = require("express").Router();

router.delete("/", tokenExtractor, async (request, response) => {
  const token = request.decodedToken.id;

  if (token) {
    await Session.destroy({
      where: {
        userId: token,
      },
    });
  }

  return response.status(204).json({ message: "Logged out successfully" });
});

module.exports = router;
