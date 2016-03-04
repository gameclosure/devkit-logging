'use strict';
/* jshint mocha: true */
/* jshint node: true */

var assert = require('assert').equal;

let logging = require('../');
let MockConsole = require('./MockConsole');


describe('gitignore', function () {
  let logger;
  let mockConsole = new MockConsole();

  before(() => {
    mockConsole.hijack();

    logger = logging.get('tests');
  });

  after(() => {
    mockConsole.undoHijack();
  });

  beforeEach(() => {
    mockConsole.clearCache();
  });

  it('basic methods operational', (done) => {
    logger.log('log test');
    logger.info('info test');
    logger.warn('warn test');
    logger.error('error test');
    assert(mockConsole.hasInCache('error', 'log test'), true);
    assert(mockConsole.hasInCache('error', 'info test'), true);
    assert(mockConsole.hasInCache('error', 'warn test'), true);
    assert(mockConsole.hasInCache('error', 'error test'), true);
    done();
  });

  it('`logging.setDefaultLevel(String)`', (done) => {
    logging.setDefaultLevel('silly');
    logger.silly('silly test');
    assert(mockConsole.hasInCache('error', 'silly test'), true);
    done();
  });
});
