# Useful logger!

## Example Logger Usage

``` javascript
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


## Example Trace Usage

### Notes

A global `trace(...)` function is exposed, and can be used to filter out particularly verbose development logs.  Trace uses environment variables by default, but can also be invoked programatically.

`DEVKIT_TRACE` {Boolean}

- Whether or not to show trace logs

`DEVKIT_TRACE_NAMES` {String}

- Comma separated list of paths to show traces for.
- If no names are specified, traces for all paths will be shown.


### Usage

#### With environment variables:

Start app with environment variables set

`DEVKIT_TRACE=true DEVKIT_TRACE_NAMES=index.js,someFolder node src/index.js`

#### Without environment variables:

``` javascript
// NOTE: Must require logging before trying to call trace()
var logging = require('devkit-logging');

logging.setTraceEnabled(true);

trace('something');


```
