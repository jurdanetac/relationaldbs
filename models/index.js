const Blog = require("./blog");
const User = require("./user");
const Reading = require("./reading");
const Session = require("./session");

// relationship of user - session
User.hasMany(Session, {
  as: "user_sessions",
});

// relationship of blog - author
User.hasMany(Blog, {
  as: "createdBlogs",
});
Blog.belongsTo(User, {
  as: "user",
});

// reading list
User.belongsToMany(Blog, { through: Reading, as: "readings" });
Blog.belongsToMany(User, { through: Reading, as: "readers" });

module.exports = {
  Blog,
  User,
  Reading,
  Session,
};
