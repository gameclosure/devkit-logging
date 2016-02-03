'use strict';

let Writable = require('stream').Writable;

let eyes = require('eyes');

let LEVELS = require('../levels');
let defaultFuncs = require('./defaultFuncs');
let prefixes = require('./prefixes');
let LoggerStream = require('./LoggerStream');
let errorToString = require('./toString').errorToString;


let inspect = eyes.inspector({
  styles: {                 // Styles applied to stdout
    all:     'white',      // Overall style applied to everything
    label:   'underline', // Inspection labels, like 'array' in `array: [1, 2, 3]`
    other:   'inverted',  // Objects which don't have a literal representation, such as functions
    key:     'bold',      // The keys in object literals, like 'a' in `{a: 1}`
    special: 'grey',      // null, undefined...
    string:  'green',
    number:  'magenta',
    bool:    'blue',      // true false
    regexp:  'green',     // /\d+/
  },
  pretty: true,
  maxLength: 2048,
  stream: null
});


class Logger extends Writable {

  constructor (tag) {
    super();

    this._tag = tag;
    this._prefix = prefixes.getPrefix(tag);

    this._level = null;

    // add logging functions
    Object.keys(LEVELS).forEach(key => {
      let logLevel = LEVELS[key];
      this[key.toLowerCase()] = () => {
        let currentLevel = this.getLevel();
        if (currentLevel >= logLevel.level) {
          let prefix;
          if (currentLevel >= (logLevel.prefixLevel || logLevel.level)){
            prefix = logLevel.prefix;
          }
          this._log(prefix, arguments);
        }
      };
    });
  };

  // adds writable streams to this logger that pipe to the console unless
  // isSilent is set to true
  createStreams (buffers, isSilent) {
    return new LoggerStream(this, buffers, isSilent);
  };

  setLevel (level) {
    this._level = level;
  };

  getLevel () {
    return this._level || LEVELS.getDefaultLevel();
  };

  format (str) {
    if (str instanceof Error) {
      if (str.showStack === false) {
        return str.toString();
      } else {
        return '\n' + errorToString(str);
      }
    }

    if (typeof str == 'object') {
      let currentLevel = this.getLevel();
      return currentLevel >= LEVELS.DEBUG.level ? inspect(str) : str;
    }

    // It's actually a string!
    return ('' + str)
      .split('\n')
      .join('\n ' + LEVELS.NONE.prefix);
  };

  _log (prefix, args) {
    // Run custom formatter on each individual argument
    args = Array.prototype.map.call(args, this.format, this);

    // Add the prefix if there is one
    if (prefix) {
      args.unshift(prefix);
    }
    // Add the render prefix (coloring, mostly)
    args.unshift(prefixes.getRenderPrefix(this._prefix));
    defaultFuncs.error.apply(defaultFuncs.console, args);
  };

  _write (chunk, encoding, cb) {
    let buffer = this._buffer || (this._buffer = '');
    buffer += chunk.toString();
    while (true) {
      let splitAt = buffer.indexOf('\n');
      if (splitAt >= 0) {
        // stderr
        defaultFuncs.error(prefixes.getRenderPrefix(this._prefix) + ' ' + this.format(buffer.substring(0, splitAt)));
        buffer = buffer.substring(splitAt + 1);
      } else {
        break;
      }
    }

    this._buffer = buffer;

    cb && cb();
  };

  getPrefix () {
    return this._prefix;
  };

  toString () {
    return this._buffer.join('\n');
  };
};

module.exports = Logger;
