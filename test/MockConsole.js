'use strict';

let defaultFuncs = require('../src/defaultFuncs');


class MockConsole {
  constructor() {
    this.cache = {};
    this.methods = ['log', 'warn', 'error'];
    this.origConsoleMethods = {};

    for (let i = 0; i < this.methods.length; i++) {
      var method = this.methods[i];
      this[method] = function() {
        this.origConsoleMethods[method].apply(console, arguments);

        let args = Array.prototype.slice.call(arguments);
        let message = '';
        for (let l = 0, m = args.length; l < m; l++) {
          message += JSON.stringify(args[l]) + ' ';
        }
        this.cache[method].push(message);
      }.bind(this);
    }

    this.clearCache();
  }

  hijack() {
    for (let i = 0; i < this.methods.length; i++) {
      var method = this.methods[i];
      this.origConsoleMethods[method] = defaultFuncs[method];
      defaultFuncs[method] = this[method];
    }
  }

  undoHijack() {
    for (let i = 0; i < this.methods.length; i++) {
      var method = this.methods[i];
      defaultFuncs[method] = this.origConsoleMethods[method];
    }
  }

  clearCache() {
    for (let i = 0; i < this.methods.length; i++) {
      var method = this.methods[i];
      this.cache[method] = [];
    }
  }

  hasInCache(method, s) {
    let cacheEntry = this.cache[method];
    for (let i = 0, j = cacheEntry.length; i < j; i++) {
      if (cacheEntry[i].indexOf(s) !== -1) {
        return true;
      }
    }
    return false;
  }
}

module.exports = MockConsole;
