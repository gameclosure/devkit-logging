'use strict';

var chalk = require('chalk');
var printf = require('printf');

var LEVELS = require('../levels');

var _lastPrefix;

module.exports.getPrefix = function (tag) {
  return chalk.cyan(printf('%18s ', tag && '[' + tag + ']' || ''));
};

module.exports.getRenderPrefix = function(newPrefix) {
  if (_lastPrefix == newPrefix) {
    return LEVELS.NONE.prefix;
  }

  _lastPrefix = newPrefix;
  return newPrefix;
};
