'use strict';

var defaultFuncs = require('./src/defaultFuncs');

var errorToString = require('./src/toString').errorToString;
var LEVELS = require('./levels');
var Logger = require('./src/Logger');
var trace = require('./src/trace');

module.exports.setDefaultLevel = LEVELS.setDefaultLevel;
module.exports.getDefaultLevel = LEVELS.getDefaultLevel;

/*
 * The formatter takes a tag and stdout/err streams and prints them nicely. used
 * by things that log. Note: always print to stderr. stdout is for passing stuff
 * between our processes.
 */
var _loggers = {};
module.exports.get = function (name, isSilent, buffers) {
  var logger = _loggers[name] || (_loggers[name] = new Logger(name));
  if (buffers) {
    logger.setBuffers(buffers, isSilent);
  }

  return logger;
};

module.exports.install = function (defaultName) {
  var logger = module.exports.get(defaultName);
  console.log = logger.log.bind(logger);
};

module.exports.setTraceEnabled = function(flag) {
  return trace.setEnabled(flag);
};
