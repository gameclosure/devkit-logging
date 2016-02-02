'use strict';

var printf = require('printf');
var chalk = require('chalk');

module.exports = {
  SILLY: {
    prefix: chalk.gray('[silly] '),
    level: 5
  },
  DEBUG: {
    prefix: chalk.gray('[debug] '),
    level: 4
  },
  LOG: {
    prefix: chalk.white('[log]   '),
    prefixLevel: 4,
    level: 3
  },
  INFO: {
    prefix: chalk.white('[info]  '),
    prefixLevel: 4,
    level: 3
  },
  WARN: {
    prefix: chalk.yellow('[warn]  '),
    level: 2
  },
  ERROR: {
    prefix: chalk.red('[error] '),
    level: 1
  },
  NONE: {
    prefix: printf('%18s ', ''),
    level: 10
  }
};

var defaultLogLevel = module.exports.INFO.level;

/**
 * @param level A number, a devkit-logging level object, or name of a devkit-logging level
 */
module.exports.setDefaultLevel = function(level) {
  var type = typeof level;

  if (type === 'number') {
    defaultLogLevel = level;
    return;
  }

  if (type === 'string') {
    var logLevel = module.exports[level.toUpperCase()];
    if (logLevel) {
      defaultLogLevel = logLevel.level;
      return;
    }
  }

  if (level && level.level !== undefined) {
    defaultLogLevel = level.level;
    return;
  }

  throw new Error('unknown log level: ' + level);
};

module.exports.getDefaultLevel = function() {
  return defaultLogLevel;
};
