 /**
 * Configurations of logger.
 */
var fs = require('fs');

const winston = require('winston');
const winstonRotator = require('winston-daily-rotate-file');

const consoleConfig = [
  new winston.transports.Console({
    'colorize': true
  })
];

const createLogger = new winston.Logger({
  'transports': consoleConfig
});

var dir = __dirname + '/logs';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 0744);
}

const successLogger = createLogger;
successLogger.add(winstonRotator, {
  'name': 'access-file',
  'level': 'info',
  'filename': __dirname + '/logs/access.log',
  'json': false,
  'datePattern': 'yyyy-MM-dd-',
  'prepend': true
});

const errorLogger = createLogger;
errorLogger.add(winstonRotator, {
  'name': 'error-file',
  'level': 'error',
  'filename': __dirname + '/logs/error.log',
  'json': false,
  'datePattern': 'yyyy-MM-dd-',
  'prepend': true
});

module.exports = {
  'successlog': successLogger,
  'errorlog': errorLogger
};