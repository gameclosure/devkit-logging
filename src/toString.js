'use strict';

let path = require('path');
let chalk = require('chalk');
let printf = require('printf');

module.exports.errorToString = function(error) {
  if (!error.stack) {
    return error;
  }

  let out = [];

  try {
    let errStr = error.stack;
    let lines = errStr.split('\n');
    let i = 0;
    let msg = [];
    while (lines[i] && !/^\s*at/.test(lines[i])) {
      msg.push(lines[i]);
      ++i;
    }

    let parser = /^\s*at (.*?)\s+\((.*?)\)/;
    lines = lines.slice(i).reverse();
    let data = lines.map((line) => {
      let result = {};
      let detailsStr;
      let match = line.match(parser);
      if (match) {
        result.func = match[1];
        detailsStr = match[2];
      } else {
        detailsStr = line;
      }

      let details = detailsStr.match(/(?:\s*at )?(.*?):(\d+):(\d+)/);
      if (details && details[1]) {
        let filename = details[1]; // path.relative(exports.paths.root(), match[2]);
        let dirname = path.dirname(filename);
        result.file = path.basename(filename);
        result.line = details[2];
        result.fullPath = (dirname == '.' ? '' : dirname + path.sep)
                        + chalk.white(result.file + ':' + result.line);
      } else {
        result.details = detailsStr;
      }

      return result;
    });

    let n = data.length;
    if (n) {
      data.map((data, i) => {
        if (typeof data == 'string') {
          out.push(data);
        } else {
          out.push(new Array(i + 1).join(' ')
            + '\u2937  ' + chalk.white(data.func)
            + ' (' + (data.fullPath || data.details) + ')');
        }
      });

      let lastLine = data[n - 1];
      if (lastLine) {
        let indent = new Array(n).join(' ');
        let msgLines = msg.join('\n').split('\n');
        let msgText = msgLines.join('\n   ' + indent);
        out.push(indent
          + chalk.red(
            msgText
            + (msgLines.length > 1 ? '\n' + indent : '')
          ));
      }
    } else {
      out.push(error.stack);
      if (error.cause && typeof error.cause == 'object') {
        Object.keys(error.cause).forEach(key => {
          out.push(printf(chalk.yellow('%15s') + ': %s', key, error.cause[key]));
        });
      }
    }
  } catch (e) {
    out.push(e.stack);
    out.push(error.stack);
  }

  return out.join('\n');
};
