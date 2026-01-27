const { JWT } = require("../utils/jwt");
const logger = require("../../logger/winston.logger");


function authTokenGuard(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    logger.warn("Unauthorized request: no auth header");
    return res.sendStatus(401);
  }
  if (!decoded) {
    logger.warn("Unauthorized request: invalid token");
    return res.sendStatus(401);
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.sendStatus(401);
  }

  const payload = JWT.verify(token);
  if (!payload) {
    return res.sendStatus(401);
  }

  req.user = payload;
  next();
}

module.exports = { authTokenGuard };
