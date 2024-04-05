require("dotenv").config();

const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);

const express = require("express");
const app = express();
app.use(express.json());

// define the model
class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  },
);

app.get("/api/blogs", async (_req, res) => {
  const blogs = await Blog.findAll();
  blogs.map((blog) => console.log(blog.toJSON()));
  res.json(blogs);
});

app.post("/api/blogs", async (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  const blog = await Blog.create(req.body);
  res.json(blog);
});

app.delete("/api/blogs/:id", async (req, res) => {
  const id = req.params.id;
  await Blog.destroy({ where: { id } });
  console.log(`Deleted blog with id ${id}`);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await Blog.sync();
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  console.log(`Server running on port ${PORT}`);
});
