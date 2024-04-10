const jwt = require("jsonwebtoken");
const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: "unknown endpoint" });
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.name);

  if (error.name === "SequelizeConnectionRefusedError") {
    return response
      .status(501)
      .send({ error: "Unable to connect to the database" });
  } else if (error.name === "NotFoundError") {
    return response.status(404).send({ error: "Not found" });
  } else if (error.name === "SequelizeValidationError") {
    return response.status(400).send({ error: error.errors[0].message });
  } else if (error.name === "SequelizeForeignKeyConstraintError") {
    return response
      .status(400)
      .send({ error: "User foreign key constraint error" });
  } else if (error.name === "WrongArgumentsError") {
    return response.status(400).send({ error: "Malformed request" });
  } else if (error.name === "SyntaxError") {
    return response.status(400).send({ error: "Syntax error" });
  } else if (error.name === "UnauthorizedError") {
    return response.status(401).send({ error: "Unauthorized" });
  } else {
    console.error(error);
    return response.status(500).send({ error: "Internal server error" });
  }
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(
        authorization.substring(7),
        process.env.SECRET,
      );
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
