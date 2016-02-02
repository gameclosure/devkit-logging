Useful logger!

Example Usage

```
var logging = require('devkit-logging');

var logger = logging.get('test');

logging.setDefaultLevel('silly');

var arr = [4, 67, 8, 9];
logger.silly('an array?', arr);

var obj = {
  x: 3,
  y: 7,
  data: {
    beep: 'boop'
  }
};
logger.debug('an object?', obj);

for (var i = 0; i < 3; i++) {
  logger.info('hello world!', i);
}

logger.warn('hello world!');

var err = new Error('Some error');
logger.error('oh no!', err);

```
