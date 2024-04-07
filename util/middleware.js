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
    return response.status(404).send({ error: "Blog not found" });
  } else if (error.name === "SequelizeValidationError") {
    return response.status(400).send({ error: "Validation error" });
  } else if (error.name === "WrongArgumentsError") {
    return response.status(400).send({ error: "Malformed request" });
  } else if (error.name === "SyntaxError") {
    return response.status(400).send({ error: "Syntax error" });
  } else {
    return response.status(500).send({ error: "Internal server error" });
  }
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
