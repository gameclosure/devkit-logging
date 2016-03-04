'use strict';

let printf = require('printf');
let chalk = require('chalk');


module.exports = {}

let levels = {
  SILLY: {
    prefix: chalk.gray('[silly] '),
    level: 5,
    onSet: () => {
      // Enable bluebird logging
      process.env.BLUEBIRD_DEBUG = 1;
    },
    onUnset: () => {
      process.env.BLUEBIRD_DEBUG = 0;
    }
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
// expose the levels on the top level export
Object.keys(levels).forEach(function(k) {
  module.exports[k] = levels[k];
});


let defaultLogLevel = module.exports.INFO;

module.exports.intToLevelObj = function(levelInt) {
  let keys = Object.keys(levels);
  for (let i = 0; i < keys.length; i++) {
    let k = keys[i];
    let v = levels[k];
    if (v.level === levelInt) {
      return v;
    }
  }
  return null;
};

/**
 * @param level A number, a devkit-logging level object, or name of a devkit-logging level
 */
module.exports.setDefaultLevel = function(level) {
  let type = typeof level;
  let logLevel;

  if (type === 'number') {
    logLevel = module.exports.intToLevelObj(level);
  }
  else if (type === 'string') {
    let inferredLogLevel = levels[level.toUpperCase()];
    if (inferredLogLevel) {
      logLevel = inferredLogLevel;
    }
  }
  // Custom object
  else if (level && level.level !== undefined && typeof level.prefix === 'string') {
    logLevel = level;
  }

  // Error if we cant find the requested level
  if (!logLevel) {
    throw new Error('unknown log level: ' + level + ' (try: ' + Object.keys(levels) +')');
  }

  // Set the default and fire event handlers (maybe)
  if (defaultLogLevel.onUnset) {
    defaultLogLevel.onUnset();
  }
  defaultLogLevel = logLevel;
  if (logLevel.onSet) {
    logLevel.onSet();
  }
};

module.exports.getDefaultLevel = function() {
  return defaultLogLevel.level;
};
