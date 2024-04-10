const router = require("express").Router();

const { Blog, User } = require("../models");

const { tokenExtractor } = require("../util/middleware");

router.get("/", async (_req, res) => {
  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ["name", "username"],
    },
  });
  blogs.map((blog) => console.log(blog.toJSON()));
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));

  if (!req.body.title || !req.body.url) {
    throw { name: "WrongArgumentsError" };
  }

  const blog = await Blog.create({ ...req.body, userId: req.decodedToken.id });

  if (!blog) {
    throw { name: "SequelizeValidationError" };
  }

  console.log(`Created blog with id ${blog.id}`);
  res.json(blog);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Blog.destroy({ where: { id } });
  console.log(`Deleted blog with id ${id}`);
  res.status(204).end();
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const likes = req.body.likes;

  if (typeof likes !== "number" || likes < 0) {
    throw { name: "WrongArgumentsError" };
  } else if (!(await Blog.findByPk(id))) {
    throw { name: "NotFoundError" };
  }

  await Blog.update({ likes }, { where: { id } });
  console.log(`Set blog with id ${id} likes to ${likes}`);
  res.send({ likes });
});

module.exports = router;
