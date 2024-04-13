const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    // https://stackoverflow.com/a/62030283
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Year must be an integer" },
        min: { args: 1991, msg: "Year must be greater than 1991" },
        max: {
          args: new Date().getFullYear(),
          msg: "Year must be less than or equal to current year",
        },
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: "blogs",
  },
);

module.exports = Blog;
