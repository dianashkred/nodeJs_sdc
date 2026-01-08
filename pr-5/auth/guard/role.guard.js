function roleGuard(allowedRoles) {
  return function (req, res, next) {
    if (!req.user || !req.user.role) {
      return res.status(401).send("Unauthorized");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).send("No permission to access this resource");
    }

    next();
  };
}

module.exports = { roleGuard };
