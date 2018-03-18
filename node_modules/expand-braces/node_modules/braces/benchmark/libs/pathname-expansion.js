'use strict';

/**
 * The below is slightly modified from https://github.com/dtudury/pathname-expansion/blob/master/lib/expandBraces.js
 * The module is not published on npm, this was just an attempt to see if
 * I should spend time doing PRs or just start from scratch. To that end,
 * some minor changes were made to get this code to work.
 *
 * Also note that this does not expand ranges, e.g. `{01..05}`
 */

var _ = require('lodash');

module.exports = function expandBraces(expressions) {
  if (_.isString(expressions)) {
    expressions = [expressions];
  }

  var expansions = _.uniq(_.reduce(expressions, function(expansions, expression) {
    return expansions.concat(_insideOut(expression));
  }, []));

  for (var i = 0; i < expansions.length; i++) {
    expansions[i] = expansions[i].replace(/\\}/g, '}');
    expansions[i] = expansions[i].replace(/\\{/g, '{');
  }
  return expansions.sort();
};

function _insideOut(expression) {
  var innerBraces = _getInnerBraces(expression);
  if (!innerBraces.length) {
    return [expression];
  }
  var choices = expression.substring(innerBraces[0] + 1, innerBraces[1]).split(',');
  return _.reduce(choices, function(expansions, choice) {
    return expansions.concat(_insideOut(expression.substring(0, innerBraces[0]) + choice + expression.substring(innerBraces[1] + 1)));
  }, []);
}

function _getInnerBraces(expression) {
  var escaped = false;
  var innerBraces = [];
  for (var i = 0; i < expression.length; i++) {
    var c = expression.charAt(i);
    if (c === '\\') escaped = true;
    else if (!escaped) {
      if (c === '{') innerBraces = [i];
      else if (c === '}') {
        if (!innerBraces.length) throw new Error('unmatched brace');
        innerBraces.push(i);
      }
    } else escaped = false;
  }
  if (innerBraces && innerBraces.length === 1) throw new Error('unmatched brace');
  return innerBraces;
}