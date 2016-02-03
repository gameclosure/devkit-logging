'use strict';

let chalk = require('chalk');
let printf = require('printf');

let LEVELS = require('../levels');

let _lastPrefix;

module.exports.getPrefix = function(tag) {
  return chalk.cyan(printf('%18s ', tag && '[' + tag + ']' || ''));
};

module.exports.getRenderPrefix = function(newPrefix) {
  if (_lastPrefix == newPrefix) {
    return LEVELS.NONE.prefix;
  }

  _lastPrefix = newPrefix;
  return newPrefix;
};
