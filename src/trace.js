'use strict';
let path = require('path');

let callsite = require('callsite');


let rootDir = path.dirname(require.main ? require.main.filename : process.cwd());
let traceNames = [];


let matchesTraceName = function(testStr) {
  if (traceNames.length === 0) {
    return true;
  }

  for (let i = 0, j = traceNames.length; i < j; i++) {
    if (testStr.indexOf(traceNames[i]) === 0) {
      return true;
    }
  }
  return false;
};

let devkitTrace = function() {
  let stack = callsite();
  let callSite = stack[1];
  let callerPath = callSite.getFileName();

  if (callerPath.indexOf(rootDir) === 0) {
    callerPath = callerPath.substring(rootDir.length + 1, callerPath.length);
  }

  if (!matchesTraceName(callerPath)) {
    return;
  }

  let args = Array.prototype.map.call(arguments, arg => {
    console.log('ARG', arg)
    return arg;
  });

  let prefix = callerPath + ':' + callSite.getLineNumber() + '|';
  args.unshift(prefix);

  console.log.apply(console, args);
};

/**
 * @param  {Boolean}   flag
 * @param  {String}   names
 */
module.exports.setEnabled = function(flag, names) {
  process.env.DEVKIT_TRACE = flag || false;
  process.env.DEVKIT_TRACE_NAMES = names || '';

  if (flag) {
    // parse trace names in to a list
    let traceNamesRaw = process.env.DEVKIT_TRACE_NAMES;
    if (traceNamesRaw) {
      traceNames = traceNamesRaw.split(',');
    } else {
      traceNames = [];
    }

    GLOBAL.trace = devkitTrace;
  } else {
    GLOBAL.trace = function() {};
  }
};

// on import, set trace enabled
module.exports.setEnabled(process.env.DEVKIT_TRACE, process.env.DEVKIT_TRACE_NAMES);
