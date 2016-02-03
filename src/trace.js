'use strict';
let path = require('path');

let callsite = require('callsite');


let rootDir = path.dirname(require.main.filename);
let traceNames = [];


let matchesTraceName = function(testStr) {
  if (traceNames.length === 0) {
    return true;
  }

  for (var i = 0, j = traceNames.length; i < j; i++) {
    if (testStr.indexOf(traceNames[i]) === 0) {
      return true;
    }
  }
  return false;
};

let devkitTrace = function() {
  var stack = callsite();
  var callSite = stack[1];
  var callerPath = callSite.getFileName();

  if (callerPath.indexOf(rootDir) === 0) {
    callerPath = callerPath.substring(rootDir.length + 1, callerPath.length);
  }

  if (!matchesTraceName(callerPath)) {
    return;
  }

  var args = Array.prototype.map.call(arguments, function(arg) {
    return arg;
  });

  var prefix = callerPath + ':' + callSite.getLineNumber() + '|';
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
    GLOBAL.trace = function () {};
  }
};

// on import, set trace enabled
module.exports.setEnabled(process.env.DEVKIT_TRACE, process.env.DEVKIT_TRACE_NAMES);
