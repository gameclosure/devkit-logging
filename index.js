'use strict';

let defaultFuncs = require('./src/defaultFuncs');

let errorToString = require('./src/toString').errorToString;
let LEVELS = require('./levels');
let Logger = require('./src/Logger');
let trace = require('./src/trace');

module.exports.LEVELS = LEVELS;
module.exports.setDefaultLevel = LEVELS.setDefaultLevel;
module.exports.getDefaultLevel = LEVELS.getDefaultLevel;

/*
 * The formatter takes a tag and stdout/err streams and prints them nicely. used
 * by things that log. Note: always print to stderr. stdout is for passing stuff
 * between our processes.
 */
let _loggers = {};
module.exports.get = function(name, isSilent, buffers) {
  let logger = _loggers[name] || (_loggers[name] = new Logger(name));
  if (buffers) {
    logger.setBuffers(buffers, isSilent);
  }

  return logger;
};

module.exports.install = function(defaultName) {
  let logger = module.exports.get(defaultName);
  console.log = logger.log.bind(logger);
};

module.exports.setTraceEnabled = function(flag) {
  return trace.setEnabled(flag);
};
