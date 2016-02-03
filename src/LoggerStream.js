'use strict';

class LoggerStream {
  constructor (logger, buffers, isSilent) {
    this._logger = logger;
    this._isSilent = isSilent === undefined ? false : isSilent;
    this._buffers = {};

    // add buffer instances
    buffers.forEach(name => {
      if (!this[name]) {
        this[name] = new Writable();
        this[name]._write = bind(this, '_buffer', name);
        this._buffers[name] = [];
      }
    });
  };

  get (name) {
    return this._buffers[name].join('');
  };

  _buffer (buffer, chunk, encoding, cb) {
    let data = chunk.toString();
    if (this._buffers[buffer]) {
      this._buffers[buffer].push(data);
    }

    if (!this._isSilent) {
      this._logger._write(data);
    }

    cb && cb();
  };
};

module.exports = LoggerStream;
