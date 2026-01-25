const winston = require('winston');
const { format } = winston;

const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

const logger = winston.createLogger({
  level: 'info', 
  format: customFormat,
  transports: [
    new winston.transports.Console({ format: format.simple() }), 
    new winston.transports.File({ filename: 'combined.log' }), 
    new winston.transports.File({ filename: 'error.log', level: 'error' }), 
  ],
});

if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }));
} else {
  logger.add(new winston.transports.File({ filename: 'combined.log' }));
}

class Logger {
  log(level, message) {
    logger.log(level, message);
  }

  info(message) {
    logger.info(message);
  }

  error(message) {
    logger.error(message);
  }

  warn(message) {
    logger.warn(message);
  }

  debug(message) {
    logger.debug(message);
  }
}

module.exports = Logger;
