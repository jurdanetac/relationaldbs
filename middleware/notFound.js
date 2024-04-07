const notFound = async function (_req, res, _next) {
  res.status(404).send("Sorry can't find that!");
};

module.exports = notFound;
