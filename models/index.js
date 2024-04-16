const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./readingList");

// relationship of blog - author
User.hasMany(Blog, {
  as: "createdBlogs",
});
Blog.belongsTo(User, {
  as: "user",
});

// reading list
User.belongsToMany(Blog, { through: ReadingList, as: "readingList" });
Blog.belongsToMany(User, { through: ReadingList, as: "readers" });

module.exports = {
  Blog,
  User,
  ReadingList,
};
