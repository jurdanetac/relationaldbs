const router = require("express").Router();

const { Op } = require("sequelize");

const { Blog, User } = require("../models");

const { tokenExtractor } = require("../util/middleware");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name", "username"],
    },
    // search in either title or author
    where: {
      [Op.or]: [
        {
          title: {
            [Op.substring]: req.query.search ? req.query.search : "",
          },
        },
        {
          author: {
            [Op.substring]: req.query.search ? req.query.search : "",
          },
        },
      ],
    },
    order: [["likes", "DESC"]],
  });
  blogs.map((blog) => console.log(blog.toJSON()));
  res.json(blogs);
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id, {
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name", "username"],
    },
  });

  if (!blog) {
    throw { name: "NotFoundError" };
  }

  res.json(blog);
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

router.delete("/:id", tokenExtractor, async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findByPk(id);

  if (!blog) {
    throw { name: "NotFoundError" };
  } else if (blog.userId !== req.decodedToken.id) {
    throw { name: "UnauthorizedError" };
  }

  await Blog.destroy({ where: { id } });
  console.log(`Deleted blog with id ${id}`);
  return res.status(200).send({ message: `Deleted blog with id ${id}` });
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
  return res.status(200).send({ likes });
});

module.exports = router;
