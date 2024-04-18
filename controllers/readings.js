const router = require("express").Router();

const { tokenExtractor } = require("../util/middleware");

const { Blog, User, Reading } = require("../models");

router.post("/", async (req, res) => {
  const { blogId, userId } = req.body;

  if (!(await User.findByPk(userId)) || !(await Blog.findByPk(blogId))) {
    throw { name: "NotFoundError" };
  }

  const record = await ReadingList.findOne(
    { where: { blogId, userId } },
    { raw: true },
  );

  if (record) {
    return res
      .status(400)
      .json({ error: "Blog already in user's reading list" });
  } else {
    ReadingList.create({
      blogId,
      userId,
    });
    return res
      .status(201)
      .json({ message: "Blog added to user's reading list" });
  }
});

router.put("/:id", tokenExtractor, async (req, res) => {
  const { read } = req.body;

  if (typeof read !== "boolean") {
    throw { name: "WrongArgumentsError" };
  }

  const blogId = Number(req.params.id);
  const userId = req.decodedToken.id;

  const record = await Reading.findOne({
    where: {
      userId,
      blogId,
    },
  });

  if (!record) {
    throw { name: "NotFoundError" };
  }

  record.read = read;
  await record.save();

  res.status(200).json({ message: "Reading status updated" });
});

module.exports = router;
