const router = require("express").Router();

const { Blog, User, ReadingList } = require("../models");

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

module.exports = router;
