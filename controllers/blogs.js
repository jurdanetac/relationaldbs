const router = require("express").Router();

const { Blog } = require("../models");

router.get("/", async (_req, res) => {
  const blogs = await Blog.findAll();
  blogs.map((blog) => console.log(blog.toJSON()));
  res.json(blogs);
});

router.post("/", async (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  const blog = await Blog.create(req.body);
  res.json(blog);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Blog.destroy({ where: { id } });
  console.log(`Deleted blog with id ${id}`);
  res.status(204).end();
});

module.exports = router;
