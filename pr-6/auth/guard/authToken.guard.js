const { JWT } = require("../utils/jwt");

function authTokenGuard(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
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
