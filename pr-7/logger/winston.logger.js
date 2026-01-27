const winston = require("winston");
const path = require("path");

const isProd = process.env.NODE_ENV === "production";

const transports = isProd
  ? [
      new winston.transports.File({
        filename: path.join("logs", "error.log"),
        level: "error",
      }),
      new winston.transports.File({
        filename: path.join("logs", "combined.log"),
      }),
    ]
  : [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ];

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports,
});

module.exports = logger;
