const jwt = require("jsonwebtoken");

class JWT {
  static sign(payload) {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || "5m";

    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.sign(payload, secret, { expiresIn });
  }

  static verify(tokenToVerify) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    try {
      return jwt.verify(tokenToVerify, secret);
    } catch {
      return null;
    }
  }
}

module.exports = { JWT };
